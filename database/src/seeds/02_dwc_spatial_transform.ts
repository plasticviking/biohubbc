import { Knex } from 'knex';

const DB_SCHEMA = process.env.DB_SCHEMA;
const DB_SCHEMA_DAPI_V1 = process.env.DB_SCHEMA_DAPI_V1;

/**
 * Add spatial transform
 *
 * @export
 * @param {Knex} knex
 * @return {*}  {Promise<void>}
 */
export async function seed(knex: Knex): Promise<void> {
  await knex.raw(`
    SET SCHEMA '${DB_SCHEMA}';
    SET SEARCH_PATH = ${DB_SCHEMA}, ${DB_SCHEMA_DAPI_V1};
  `);

  const response = await knex.raw(`
    ${checkTransformExists()}
  `);

  if (!response?.rows?.[0]) {
    await knex.raw(`
      ${insertSpatialTransform()}
    `);
  } else {
    await knex.raw(`
    ${updateSpatialTransform()}
  `);
  }
}

const checkTransformExists = () => `
  SELECT
    spatial_transform_id
  FROM
    spatial_transform
  WHERE
    name = 'DwC Occurrences';
`;

/**
 * SQL to insert DWC Occurrences transform
 *
 */
const insertSpatialTransform = () => `
  INSERT into spatial_transform
    (name, description, record_effective_date, transform)
  VALUES (
    'DwC Occurrences', 'Extracts occurrences and properties from DwC JSON source.', now(),${transformString}
  );
`;

const updateSpatialTransform = () => `
UPDATE
  spatial_transform SET transform = ${transformString}
WHERE
name = 'DwC Occurrences';
`;

const transformString = `
$transform$
with submission as (select *
  from occurrence_submission
  where occurrence_submission_id = ?)
            , occurrences as (select occurrence_submission_id, occs
  from submission, jsonb_path_query(darwin_core_source, '$.occurrence') occs)
            , occurrence as (select occurrence_submission_id, jsonb_array_elements(occs) occ
  from occurrences)
            , events as (select evns
  from submission, jsonb_path_query(darwin_core_source, '$.event') evns)
            , event as (select jsonb_array_elements(evns) evn
  from events)
           , locations as (select locs
  from submission, jsonb_path_query(darwin_core_source, '$.location') locs)
            , location as (select jsonb_array_elements(locs) loc
  from locations)
            , event_coord as (select coalesce(st_x(pt), 0) x, coalesce(st_y(pt), 0) y, loc
  from location, ST_SetSRID(ST_MakePoint((nullif(loc->>'decimalLongitude', ''))::float, (nullif(loc->>'decimalLatitude', ''))::float), 4326) pt)
  , normal as (select distinct o.occurrence_submission_id, o.occ, ec.*, e.evn
  from occurrence o
  left outer join event_coord ec on
            (ec.loc->'eventID' = o.occ->'eventID')
  left outer join event e on
        (e.evn->'eventID' = o.occ->'eventID'))
        select jsonb_build_object('type', 'FeatureCollection'
                        , 'features', jsonb_build_array(jsonb_build_object('type', 'Feature'
                        , 'geometry', jsonb_build_object('type', 'Point', 'coordinates', json_build_array(n.x, n.y))
                        , 'properties', jsonb_build_object('type', 'Occurrence', 'dwc', jsonb_build_object(
                          'type', 'PhysicalObject', 'basisOfRecord', 'Occurrence', 'datasetID', n.occurrence_submission_id, 'occurrenceID', n.occ->'occurrenceID'
                          , 'sex', n.occ->'sex', 'lifeStage', n.occ->'lifeStage', 'taxonID', n.occ->'taxonID', 'vernacularName', n.occ->'vernacularName', 'individualCount', n.occ->'individualCount'
                          , 'eventDate', n.evn->'eventDate', 'verbatimSRS', n.loc->'verbatimSRS', 'verbatimCoordinates', n.loc->'verbatimCoordinates'
                          ))))
                  )result_data
  from normal n;
$transform$`;
