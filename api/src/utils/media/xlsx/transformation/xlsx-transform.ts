import jsonpatch, { Operation } from 'fast-json-patch';
import { JSONPath, JSONPathOptions } from 'jsonpath-plus';
import xlsx from 'xlsx';
import { getWorksheetByName, getWorksheetRange, prepareWorksheetCells } from '../xlsx-utils';
import XLSXTransformSchemaParser, {
  ConditionSchema,
  DWCColumnName,
  DWCSheetName,
  IfNotEmptyCheck,
  JSONPathString,
  TemplateColumnName,
  TemplateMetaSchema,
  TemplateMetaSchemaType,
  TemplateSheetName,
  TransformSchema
} from './xlsx-transform-schema-parser';
import { filterDuplicateKeys, getCombinations } from './xlsx-transform-utils';

export type NonObjectPrimitive = string | number | null | boolean;

/**
 * Defines a type that indicates a `Partial` value, but with some exceptions.
 *
 * @example
 * type MyType = {
 *   val1: string,  // required
 *   val2: number,  // required
 *   val3: boolean  // required
 * }
 *
 * Partial<MyType> = {
 *   val1?: string,  // optional
 *   val2?: number,  // optional
 *   val3?: noolean, // optional
 * }
 *
 * AtLeast<MyType, 'val1' | 'val2'> = {
 *   val1: string,  // required
 *   val2: number,  // required
 *   val3?: boolean // optional
 * }
 */
type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

/**
 * Contains information about a single row, including information about its parent row and/or child row(s).
 *
 * It also includes calculated fields that are often used repeatedly, where re-calculation would be impossible or
 * inefficient.
 */
export type RowObject = {
  /**
   * The row data.
   *
   * @type {{ [key: string]: NonObjectPrimitive }}
   */
  _data: { [key: string]: NonObjectPrimitive };
  /**
   * The name of the source file/sheet.
   *
   * @type {string}
   */
  _name: string;
  /**
   * The key for this row.
   *
   * @type {string}
   */
  _key: string;
  /**
   * The key of the parent row, if there is one.
   *
   * Note: All row objects will have a parent, unless they are `_type='root'`
   *
   * @type {string}
   */
  _parentKey: string;
  /**
   * The type of the row object.
   *
   * @type {TemplateMetaSchemaType}
   */
  _type: TemplateMetaSchemaType;
  /**
   * The index of the row from the source file.
   *
   * @type {number}
   */
  _row: number;
  /**
   * The keys of all connected child rows, if any.
   *
   * @type {string[]}
   */
  _childKeys: string[];
  /**
   * The child row objects, if any.
   *
   * @type {RowObject[]}
   */
  _children: RowObject[];
};

export class XLSXTransform {
  workbook: xlsx.WorkBook;
  schemaParser: XLSXTransformSchemaParser;

  _uniqueIncrement = 0;

  constructor(workbook: xlsx.WorkBook, schema: TransformSchema) {
    this.workbook = workbook;
    this.schemaParser = new XLSXTransformSchemaParser(schema);
  }

  /**
   * Run the transformation process.
   *
   * @memberof XLSXTransform
   */
  start() {
    // Prepare the raw data, by adding keys and other dwcMeta to the raw row objects
    const preparedRowObjects = this.prepareRowObjects();

    // Recurse through the data, and create a hierarchical structure for each logical record
    const hierarchicalRowObjects = this.buildRowObjectsHierarchy(preparedRowObjects);

    // Iterate over the hierarchical row objects, mapping original values to their DWC equivalents
    const processedHierarchicalRowObjects = this.processHierarchicalRowObjects(hierarchicalRowObjects);

    // Iterate over the Darwin Core records, group them by DWC sheet name, and remove duplicate records in each sheet
    return this.prepareRowObjectsForJSONToSheet(processedHierarchicalRowObjects);
  }

  /**
   * Modifies the raw row objects returned by xlsx, and adds additional data (row numbers, keys, etc) that will be used
   * in later steps of the transformation process.
   *
   * @return {*}  {Record<TemplateSheetName, RowObject[]>}
   * @memberof XLSXTransform
   */
  prepareRowObjects(): Record<TemplateSheetName, RowObject[]> {
    const output: Record<TemplateSheetName, RowObject[]> = {};

    this.workbook.SheetNames.forEach((sheetName) => {
      const templateMetaSchema = this.schemaParser.getTemplateMetaConfigBySheetName(sheetName);

      if (!templateMetaSchema) {
        // Skip worksheet as no transform schema was provided
        return;
      }

      const worksheet = getWorksheetByName(this.workbook, sheetName);

      // Trim all whitespace on string values
      prepareWorksheetCells(worksheet);

      const range = getWorksheetRange(worksheet);

      if (!range) {
        throw Error('Worksheet range is undefined');
      }

      const worksheetJSON = xlsx.utils.sheet_to_json<Record<TemplateColumnName, any>>(worksheet, {
        blankrows: false,
        raw: true,
        rawNumbers: false
      });

      const numberOfRows = range['e']['r'];

      const preparedRowObjects = this._prepareRowObjects(worksheetJSON, templateMetaSchema, numberOfRows);

      output[sheetName] = preparedRowObjects;
    });

    return output;
  }

  _prepareRowObjects(
    worksheetJSON: Record<TemplateColumnName, any>[],
    templateMetaSchema: TemplateMetaSchema,
    numberOfRows: number
  ): RowObject[] {
    const worksheetJSONWithKey: RowObject[] = [];

    for (let i = 0; i < numberOfRows; i++) {
      const primaryKey = this._getKeyForRowObject(worksheetJSON[i], templateMetaSchema.primaryKey);

      if (!primaryKey) {
        continue;
      }

      const parentKey = this._getKeyForRowObject(worksheetJSON[i], templateMetaSchema.parentKey);

      const childKeys = templateMetaSchema.foreignKeys
        .map((foreignKeys: { sheetName: TemplateColumnName; primaryKey: string[] }) => {
          return this._getKeyForRowObject(worksheetJSON[i], foreignKeys.primaryKey);
        })
        .filter((item): item is string => !!item);

      worksheetJSONWithKey.push({
        _data: { ...worksheetJSON[i] },
        _name: templateMetaSchema.sheetName,
        _key: primaryKey,
        _parentKey: parentKey,
        _type: templateMetaSchema.type,
        // add 2 to _row: while the transform array index starts at 0, actual csv data (excel) starts at 1. And with the
        // header row removed, the first real data rows start at 2. This _row value does not have to match the data row
        // precisely, but it is convenient if they do as it better aligns with a humans understanding of the data.
        _row: i + 2,
        _childKeys: childKeys || [],
        _children: []
      });
    }

    return worksheetJSONWithKey;
  }

  _getKeyForRowObject(RowObject: Record<TemplateColumnName, any>, keyColumnNames: string[]): string {
    if (!keyColumnNames.length) {
      return '';
    }

    if (!RowObject || Object.getPrototypeOf(RowObject) !== Object.prototype || Object.keys(RowObject).length === 0) {
      return '';
    }

    const primaryKey: string = keyColumnNames
      .map((columnName: string) => {
        return RowObject[columnName];
      })
      .filter(Boolean)
      .join(':');

    return primaryKey;
  }

  /**
   * De-normalize the original template data into a nested hierarchical object structure, based on the `templateMeta`
   * portion of the transform config.
   *
   * @param {Record<TemplateSheetName, RowObject[]>} preparedRowObjects
   * @return {*}  {{ _children: RowObject[] }}
   * @memberof XLSXTransform
   */
  buildRowObjectsHierarchy(preparedRowObjects: Record<TemplateSheetName, RowObject[]>): { _children: RowObject[] } {
    const hierarchicalRowObjects: { _children: RowObject[] } = { _children: [] };

    for (const templateMetaItem of this.schemaParser.preparedTransformSchema.templateMeta) {
      const sheetName = templateMetaItem.sheetName;

      const rowObjects = preparedRowObjects[sheetName];

      if (!rowObjects) {
        // No row objects for sheet
        continue;
      }

      const distanceToRoot = templateMetaItem.distanceToRoot;
      if (distanceToRoot === 0) {
        // These are root row objects, and can be added to the `hierarchicalRowObjects` array directly as they have no
        // parent to be nested under
        hierarchicalRowObjects._children = rowObjects;

        continue;
      }

      // Add non-root row objects
      for (const rowObjectsItem of rowObjects) {
        const pathsToPatch: string[] = JSONPath({
          json: hierarchicalRowObjects,
          path: `$${'._children[*]'.repeat(distanceToRoot - 1)}._children[?(@._childKeys.indexOf("${
            rowObjectsItem._parentKey
          }") != -1)]`,
          resultType: 'pointer'
        });

        if (pathsToPatch.length === 0) {
          // Found no parent row object, even though this row object is a non-root row object
          // This could indicate a possible error in the transform schema or the raw data
          continue;
        }

        const patchOperations: Operation[] = pathsToPatch.map((pathToPatch) => {
          return { op: 'add', path: `${pathToPatch}/_children/`, value: rowObjectsItem };
        });

        jsonpatch.applyPatch(hierarchicalRowObjects, patchOperations);
      }
    }

    return hierarchicalRowObjects;
  }

  /**
   * Map the original template data to their corresponding DWC terms, based on the operations in the `map` portion
   * of the transform config.
   *
   * @param {{
   *     _children: RowObject[];
   *   }} hierarchicalRowObjects
   * @return {*}  {Record<DWCSheetName, Record<DWCColumnName, string>[]>[]}
   * @memberof XLSXTransform
   */
  processHierarchicalRowObjects(hierarchicalRowObjects: {
    _children: RowObject[];
  }): Record<DWCSheetName, Record<DWCColumnName, string>[]>[] {
    const mapRowObjects: Record<DWCSheetName, Record<DWCColumnName, string>[]>[] = [];

    // For each hierarchicalRowObjects
    for (const hierarchicalRowObjectsItem of hierarchicalRowObjects._children) {
      const flattenedRowObjects = this._flattenHierarchicalRowObject(hierarchicalRowObjectsItem);

      for (const flattenedRowObjectsItem of flattenedRowObjects) {
        const result = this._mapFlattenedRowObject(flattenedRowObjectsItem as RowObject[]);

        mapRowObjects.push(result);
      }
    }

    return mapRowObjects;
  }

  _flattenHierarchicalRowObject(hierarchicalRowObject: RowObject) {
    const flattenedRowObjects: AtLeast<RowObject, '_children'>[][] = [
      // Wrap the root element in `_children` so that the looping logic doesn't have to distinguish between the root
      // element and subsequent children elements, it can just always grab the `_children`, of which the first one
      // just so happens to only contain the root element.
      [{ _children: [{ ...hierarchicalRowObject }] }]
    ];

    const prepGetCombinations = (source: AtLeast<RowObject, '_children'>[]): Record<TemplateSheetName, RowObject[]> => {
      const prepGetCombinations: Record<TemplateSheetName, RowObject[]> = {};

      for (const sourceItem of source) {
        if (sourceItem._type === 'leaf') {
          // This node is marked as a leaf, so do not descend into its children.
          continue;
        }

        const children = sourceItem._children;

        for (const childrenItem of children) {
          if (!prepGetCombinations[childrenItem._name]) {
            prepGetCombinations[childrenItem._name] = [];
          }

          prepGetCombinations[childrenItem._name].push(childrenItem);
        }
      }

      return prepGetCombinations;
    };

    const loop = (index: number, source: AtLeast<RowObject, '_children'>[]) => {
      // Grab all of the children of the current `source` and build an object in the format needed by the `getCombinations`
      // function.
      const preppedForGetCombinations = prepGetCombinations(source);

      // Loop over the prepped records, and build an array of objects which contain all of the possible combinations
      // of the records. See function for more details.
      const combinations = getCombinations(preppedForGetCombinations);

      if (combinations.length === 0) {
        // No combinations elements, which means there were no children to process, indicating we've reached the end of
        // the tree
        return;
      }

      if (combinations.length > 1) {
        // This for loop is intentionally looping backwards, and stopping 1 element short of the 0'th element.
        // This is because we only want to process the additional elements, pushing them onto the array, and leaving
        // the code further below to handle the 0'th element, which will be set at the current `index`
        for (let getCombinationsIndex = combinations.length - 1; getCombinationsIndex > 0; getCombinationsIndex--) {
          let newSource: AtLeast<RowObject, '_children'>[] = [];
          for (const sourceItem of source) {
            if (Object.keys(sourceItem).length <= 1) {
              continue;
            }
            newSource.push({ ...sourceItem, _children: [] });
          }
          newSource = newSource.concat(Object.values(combinations[getCombinationsIndex]));
          flattenedRowObjects.push(newSource);
        }
      }

      // Handle the 0'th element of `combinations`, setting the `newSource` at whatever the current `index` is
      let newSource: AtLeast<RowObject, '_children'>[] = [];
      for (const sourceItem of source) {
        if (Object.keys(sourceItem).length <= 1) {
          continue;
        }
        newSource.push({ ...sourceItem, _children: [] });
      }
      newSource = newSource.concat(Object.values(combinations[0]));
      flattenedRowObjects[index] = newSource;

      // Recurse into the newSource
      loop(index, newSource);
    };

    // For each element in `flattenedRowObjects`, recursively descend through its children, flattening them as we
    // go. If 2 children are of the same type, then push a copy of the current `flattenedRowObjects` element onto
    // the `flattenedRowObjects` array, which will be processed on the next iteration of the for loop.
    for (const [flatIndex, flattenedRowObjectsItem] of flattenedRowObjects.entries()) {
      loop(flatIndex, flattenedRowObjectsItem);
    }

    return flattenedRowObjects;
  }

  _mapFlattenedRowObject(flattenedRow: RowObject[]) {
    const output: Record<DWCSheetName, Record<DWCColumnName, string>[]> = {};

    const indexBySheetName: Record<TemplateSheetName, number> = {};

    const mapSchema = [...this.schemaParser.preparedTransformSchema.map];

    // For each sheet
    for (const mapSchemaItem of mapSchema) {
      // Check conditions, if any
      const sheetCondition = mapSchemaItem.condition;
      if (sheetCondition) {
        if (!this._processCondition(sheetCondition, flattenedRow)) {
          // Conditions not met, skip processing this item
          continue;
        }
      }

      const sheetName = mapSchemaItem.sheetName;

      if (!output[sheetName]) {
        output[sheetName] = [];
        indexBySheetName[sheetName] = 0;
      } else {
        indexBySheetName[sheetName] = indexBySheetName[sheetName] + 1;
      }

      const fields = mapSchemaItem.fields;

      if (fields?.length) {
        // For each item in the `fields` array
        for (const fieldsItem of fields) {
          // The final computed cell value for this particular schema field element
          let cellValue = '';

          const columnName = fieldsItem.columnName;
          const columnValue = fieldsItem.columnValue;

          // For each item in the `columnValue` array
          for (const columnValueItem of columnValue) {
            // Check conditions, if any
            const columnValueItemCondition = columnValueItem.condition;
            if (columnValueItemCondition) {
              if (!this._processCondition(columnValueItemCondition, flattenedRow)) {
                // Conditions not met, skip processing this item
                continue;
              }
            }

            // Check for static value
            const columnValueItemValue = columnValueItem.static;
            if (columnValueItemValue) {
              // cell value is a static value
              cellValue = columnValueItemValue;
            }

            // Check for path value(s)
            const columnValueItemPaths = columnValueItem.paths;
            if (columnValueItemPaths) {
              const pathValues = this._processPaths(columnValueItemPaths, flattenedRow);

              let pathValue = '';
              if (Array.isArray(pathValues)) {
                // cell value is the concatenation of multiple values
                pathValue = (pathValues.length && pathValues.flat(Infinity).join(columnValueItem.join ?? ':')) || '';
              } else {
                // cell value is a single value
                pathValue = pathValues || '';
              }

              cellValue = pathValue;

              // Add the optional postfix
              const columnValueItemPostfix = columnValueItem.postfix;
              if (cellValue && columnValueItemPostfix) {
                let postfixValue = '';

                if (columnValueItemPostfix.static) {
                  postfixValue = columnValueItemPostfix.static;

                  if (columnValueItemPostfix.static === 'unique') {
                    postfixValue = String(this._getNextUniqueNumber());
                  }
                }

                if (columnValueItemPostfix.paths) {
                  const postfixPathValues = this._processPaths(columnValueItemPostfix.paths, flattenedRow);

                  if (Array.isArray(postfixPathValues)) {
                    // postfix value is the concatenation of multiple values
                    postfixValue =
                      (postfixPathValues.length &&
                        postfixPathValues.flat(Infinity).join(columnValueItem.join ?? ':')) ||
                      '';
                  } else {
                    // postfix value is a single value
                    postfixValue = postfixPathValues || '';
                  }
                }

                cellValue = `${cellValue}${columnValueItem.join ?? ':'}${postfixValue}`;
              }
            }

            // Check for `add` additions at the field level
            const columnValueItemAdd = columnValueItem.add;
            if (columnValueItemAdd?.length) {
              for (const columnValueItemAddItem of columnValueItemAdd) {
                mapSchema.push(columnValueItemAddItem);
              }
            }

            if (cellValue) {
              // One of the columnValue array items yielded a non-empty cell value, skip any remaining columnValue items.
              break;
            }
          }

          // add the cell key value
          output[sheetName][indexBySheetName[sheetName]] = {
            ...output[sheetName][indexBySheetName[sheetName]],
            [columnName]: cellValue
          };
        }
      }

      // Check for additions at the sheet level
      const sheetAdds = mapSchemaItem.add;
      if (sheetAdds?.length) {
        for (const sheetAddsItem of sheetAdds) {
          mapSchema.push(sheetAddsItem);
        }
      }
    }

    return output;
  }

  /**
   * Process a transform config `condition`, returning `true` if the condition passed and `false` otherwise.
   *
   * @param {ConditionSchema} condition
   * @param {RowObject[]} rowObjects
   * @return {*}  {boolean} `true` if the condition passed, `false` otherwise
   * @memberof XLSXTransform
   */
  _processCondition(condition: ConditionSchema, rowObjects: RowObject[]): boolean {
    if (!condition) {
      // No conditions to process
      return true;
    }

    const conditionsMet = new Set<boolean>();

    for (const checksItem of condition.checks) {
      if (checksItem.ifNotEmpty) {
        conditionsMet.add(this._processIfNotEmptyCondition(checksItem, rowObjects));
      }
    }

    let result = false;

    if (condition.type === 'or') {
      // condition passes if at least 1 check passes (logical `or`)
      result = conditionsMet.has(true);
    } else {
      // condition passes if no check fails (logical `and`)
      result = !conditionsMet.has(false);
    }

    if (condition.not) {
      // if `true`, negate the result of the condition (logical `not`)
      result = !result;
    }

    return result;
  }

  _processIfNotEmptyCondition(check: IfNotEmptyCheck, rowObjects: RowObject[]): boolean {
    const pathValues = this._processPaths([check.ifNotEmpty], rowObjects);

    let result = false;

    if (pathValues?.length) {
      // path is not empty
      result = true;
    }

    if (check.not) {
      // if `true`, negate the result of the condition (logical `not`)
      result = !result;
    }

    return result;
  }

  _processPaths(paths: JSONPathString[], json: JSONPathOptions['json']): string | string[] | string[][] {
    if (paths.length === 0) {
      return '';
    }

    if (paths.length === 1) {
      return JSONPath({ path: paths[0], json: json }) || '';
    }

    const values = [];

    for (const pathsItem of paths) {
      const value = JSONPath({ path: pathsItem, json: json }) || '';

      if (value) {
        values.push(value);
      }
    }

    return values;
  }

  /**
   * Groups all of the DWC records based on DWC sheet name.
   *
   * @param {Record<DWCSheetName, Record<DWCColumnName, string>[]>[]} processedHierarchicalRowObjects
   * @return {*}  {Record<DWCSheetName, Record<DWCColumnName, string>[]>}
   * @memberof XLSXTransform
   */
  prepareRowObjectsForJSONToSheet(
    processedHierarchicalRowObjects: Record<DWCSheetName, Record<DWCColumnName, string>[]>[]
  ): Record<DWCSheetName, Record<DWCColumnName, string>[]> {
    const groupedByDWCSheetName: Record<DWCSheetName, Record<DWCColumnName, string>[]> = {};
    const uniqueGroupedByDWCSheetName: Record<DWCSheetName, Record<DWCColumnName, string>[]> = {};

    const dwcSheetNames = this.schemaParser.getDWCSheetNames();

    dwcSheetNames.forEach((sheetName) => {
      groupedByDWCSheetName[sheetName] = [];
      uniqueGroupedByDWCSheetName[sheetName] = [];
    });

    processedHierarchicalRowObjects.forEach((item) => {
      const entries = Object.entries(item);
      for (const [key, value] of entries) {
        groupedByDWCSheetName[key] = groupedByDWCSheetName[key].concat(value);
      }
    });

    Object.entries(groupedByDWCSheetName).forEach(([key, value]) => {
      const keys = this.schemaParser.getDWCSheetKeyBySheetName(key);
      uniqueGroupedByDWCSheetName[key] = filterDuplicateKeys(value, keys) as any;
    });

    return uniqueGroupedByDWCSheetName;
  }

  _getNextUniqueNumber(): number {
    return this._uniqueIncrement++;
  }
}
