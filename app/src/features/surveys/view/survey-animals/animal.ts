import { DATE_LIMIT } from 'constants/dateTimeFormats';
import { omit, omitBy } from 'lodash-es';
import moment from 'moment';
import yup from 'utils/YupSchema';
import { v4 } from 'uuid';
import { AnyObjectSchema, InferType, reach } from 'yup';

/**
 * Provides an acceptable amount of type security with formik field names for animal forms
 * Returns formatted field name in regular or array format
 */
export const getAnimalFieldName = <T>(animalKey: keyof IAnimal, fieldKey: keyof T, idx?: number) => {
  return idx === undefined ? `${animalKey}.${String(fieldKey)}` : `${animalKey}.${idx}.${String(fieldKey)}`;
};

/**
 * Checks if last added value in animal form is valid.
 * Used to disable add btn.
 * ie: Added measurement, checks the measurement has no errors.
 */
export const lastAnimalValueValid = (animalKey: keyof IAnimal, values: IAnimal) => {
  const section = values[animalKey];
  const lastIndex = section.length - 1;
  const lastValue = section[lastIndex];
  if (!lastValue) {
    return true;
  }
  const schema = reach(AnimalSchema, `${animalKey}[${lastIndex}]`);
  return schema.isValidSync(lastValue);
};

/**
 * Checks if property in schema is required. Used to keep required fields in sync with schema.
 * ie: { required: true } -> { required: isReq(Schema, 'property_name') }
 */
export const isRequiredInSchema = <T extends AnyObjectSchema>(schema: T, key: keyof T['fields']): boolean => {
  return Boolean(schema.fields[key].exclusiveTests.required);
};

export const glt = (num: number, greater = true) => `Must be ${greater ? 'greater' : 'less'} than or equal to ${num}`;

const req = 'Required';
const mustBeNum = 'Must be a number';
const numSchema = yup.number().typeError(mustBeNum);
const latSchema = yup.number().min(-90, glt(-90)).max(90, glt(90, false)).typeError(mustBeNum);
const lonSchema = yup.number().min(-180, glt(-180)).max(180, glt(180, false)).typeError(mustBeNum);
const dateSchema = yup
  .date()
  .min(moment(DATE_LIMIT.min), `Must be after ${DATE_LIMIT.min}`)
  .max(moment(DATE_LIMIT.max), `Must be before ${DATE_LIMIT.max}`)
  .typeError('Invalid date format');

export type ProjectionMode = 'wgs' | 'utm';

export const AnimalGeneralSchema = yup.object({}).shape({
  taxon_id: yup.string().required(req),
  animal_id: yup.string().required(req),
  taxon_name: yup.string()
});

export const AnimalCaptureSchema = yup.object({}).shape({
  _id: yup.string().required(),

  capture_longitude: lonSchema.when('projection_mode', { is: 'wgs', then: lonSchema.required(req) }),
  capture_latitude: latSchema.when('projection_mode', { is: 'wgs', then: latSchema.required(req) }),
  capture_utm_northing: numSchema.when('projection_mode', { is: 'utm', then: numSchema.required(req) }),
  capture_utm_easting: numSchema.when('projection_mode', { is: 'utm', then: numSchema.required(req) }),
  capture_timestamp: dateSchema.required(req),
  capture_coordinate_uncertainty: numSchema.required(req),
  capture_comment: yup.string(),
  projection_mode: yup.mixed().oneOf(['wgs', 'utm']),
  show_release: yup.boolean().required(), // used for conditional required release fields
  release_longitude: lonSchema.when(['projection_mode', 'show_release'], {
    is: (projection_mode: ProjectionMode, show_release: boolean) => projection_mode === 'wgs' && show_release,
    then: lonSchema.required(req)
  }),
  release_latitude: latSchema.when(['projection_mode', 'show_release'], {
    is: (projection_mode: ProjectionMode, show_release: boolean) => projection_mode === 'wgs' && show_release,
    then: latSchema.required(req)
  }),
  release_utm_northing: numSchema.when(['projection_mode', 'show_release'], {
    is: (projection_mode: ProjectionMode, show_release: boolean) => projection_mode === 'utm' && show_release,
    then: numSchema.required(req)
  }),
  release_utm_easting: numSchema.when(['projection_mode', 'show_release'], {
    is: (projection_mode: ProjectionMode, show_release: boolean) => projection_mode === 'utm' && show_release,
    then: numSchema.required(req)
  }),
  release_coordinate_uncertainty: numSchema.when('show_release', { is: true, then: numSchema.required(req) }),
  release_timestamp: dateSchema.when('show_release', { is: true, then: dateSchema.required(req) }),
  release_comment: yup.string().optional()
});

export const AnimalMarkingSchema = yup.object({}).shape({
  _id: yup.string().required(),

  marking_type_id: yup.string().required(req),
  taxon_marking_body_location_id: yup.string().required(req),
  primary_colour_id: yup.string().optional(),
  secondary_colour_id: yup.string().optional(),
  marking_comment: yup.string()
});
//proprietaryDataForm
export const AnimalMeasurementSchema = yup.object({}).shape(
  {
    _id: yup.string().required(),

    taxon_measurement_id: yup.string().required(req),
    qualitative_option_id: yup.string().when('value', {
      is: (value: '' | number) => value === 0 || !value,
      then: yup.string().required(req),
      otherwise: yup.string()
    }),
    value: numSchema.when('qualitative_option_id', {
      is: (qualitative_option_id: string) => !qualitative_option_id,
      then: numSchema.required(req),
      otherwise: numSchema
    }),
    measured_timestamp: dateSchema.required(req),
    measurement_comment: yup.string()
  },
  [['value', 'qualitative_option_id']]
);

export const AnimalMortalitySchema = yup.object({}).shape({
  _id: yup.string().required(),

  mortality_longitude: lonSchema.when('projection_mode', { is: 'wgs', then: lonSchema.required(req) }),
  mortality_latitude: latSchema.when('projection_mode', { is: 'wgs', then: latSchema.required(req) }),
  mortality_utm_northing: numSchema.when('projection_mode', { is: 'utm', then: numSchema.required(req) }),
  mortality_utm_easting: numSchema.when('projection_mode', { is: 'utm', then: numSchema.required(req) }),
  mortality_timestamp: dateSchema.required(req),
  mortality_coordinate_uncertainty: numSchema,
  mortality_comment: yup.string(),
  mortality_pcod_reason: yup.string().uuid().required(req),
  mortality_pcod_confidence: yup.string(),
  mortality_pcod_taxon_id: yup.string().uuid(),
  mortality_ucod_reason: yup.string().uuid(),
  mortality_ucod_confidence: yup.string(),
  mortality_ucod_taxon_id: yup.string().uuid(),
  projection_mode: yup.mixed().oneOf(['wgs', 'utm'])
});

export const AnimalRelationshipSchema = yup.object({}).shape({
  _id: yup.string().required(),

  family_id: yup.string().required(req),
  relationship: yup.mixed().oneOf(['parent', 'child', 'sibling']).required(req)
});

const AnimalTelemetryDeviceSchema = yup.object({}).shape({
  device_id: yup.string().required(req),
  manufacturer: yup.string().required(req),
  //I think this needs an additional field for hz
  device_frequency: numSchema.required(req),
  model: yup.string().required(req)
});

const AnimalImageSchema = yup.object({}).shape({});

export const AnimalSchema = yup.object({}).shape({
  general: AnimalGeneralSchema,
  captures: yup.array().of(AnimalCaptureSchema).required(),
  markings: yup.array().of(AnimalMarkingSchema).required(),
  measurements: yup.array().of(AnimalMeasurementSchema).required(),
  mortality: yup.array().of(AnimalMortalitySchema).required(),
  family: yup.array().of(AnimalRelationshipSchema).required(),
  images: yup.array().of(AnimalImageSchema).required(),
  device: AnimalTelemetryDeviceSchema.default(undefined)
});

export const LocationSchema = yup.object({}).shape({
  location_id: yup.string(),
  latitude: yup.number(),
  longitude: yup.number(),
  coordinate_uncertainty: yup.number(),
  coordinate_uncertainty_unit: yup.string()
});

//Animal form related types

export type IAnimalGeneral = InferType<typeof AnimalGeneralSchema>;

export type IAnimalCapture = InferType<typeof AnimalCaptureSchema>;

export type IAnimalMarking = InferType<typeof AnimalMarkingSchema>;

export type IAnimalMeasurement = InferType<typeof AnimalMeasurementSchema>;

export type IAnimalMortality = InferType<typeof AnimalMortalitySchema>;

export type IAnimalRelationship = InferType<typeof AnimalRelationshipSchema>;

export type IAnimalTelemetryDevice = InferType<typeof AnimalTelemetryDeviceSchema>;

export type IAnimalImage = InferType<typeof AnimalImageSchema>;

export type IAnimal = InferType<typeof AnimalSchema>;

export type IAnimalKey = keyof IAnimal;

//Critterbase related types
type ICritterID = { critter_id: string };

type ICritterLocation = InferType<typeof LocationSchema>;

type ICritterMortality = Omit<
  ICritterID &
    IAnimalMortality & {
      location_id: string;
    },
  | '_id'
  | 'mortality_utm_easting'
  | 'mortality_utm_northing'
  | 'projection_mode'
  | 'mortality_latitude'
  | 'mortality_longitude'
  | 'mortality_coordinate_uncertainty'
>;

type ICritterCapture = Omit<
  ICritterID &
    Pick<IAnimalCapture, 'capture_timestamp' | 'release_timestamp' | 'release_comment' | 'capture_comment'> & {
      capture_location_id: string;
      release_location_id: string | undefined;
    },
  '_id'
>;

export type ICritterMarking = Omit<ICritterID & IAnimalMarking, '_id'>;

type ICritterQualitativeMeasurement = Omit<ICritterID & IAnimalMeasurement, 'value' | '_id'>;

type ICritterQuantitativeMeasurement = Omit<ICritterID & IAnimalMeasurement, 'qualitative_option_id' | '_id'>;

type ICapturesAndLocations = { captures: ICritterCapture[]; capture_locations: ICritterLocation[] };
type IMortalityAndLocation = { mortalities: ICritterMortality[]; mortalities_locations: ICritterLocation[] };

export const newFamilyIdPlaceholder = 'New Family';

type ICritterFamilyParent = {
  family_id: string;
  parent_critter_id: string;
};

type ICritterFamilyChild = {
  family_id: string;
  child_critter_id: string;
};

type ICritterFamily = {
  family_id: string;
  family_label: string;
};

type ICritterRelationships = {
  parents: ICritterFamilyParent[];
  children: ICritterFamilyChild[];
  families: ICritterFamily[];
};

//Converts IAnimal(Form data) to a Critterbase Critter

export class Critter {
  critter_id: string;
  taxon_id: string;
  animal_id: string;
  captures: ICritterCapture[];
  markings: ICritterMarking[];
  measurements: {
    qualitative: ICritterQualitativeMeasurement[];
    quantitative: ICritterQuantitativeMeasurement[];
  };
  mortalities: Omit<ICritterMortality, '_id'>[];
  families: ICritterRelationships;
  locations: ICritterLocation[];

  private taxon_name?: string;

  get name(): string {
    return `${this.animal_id}-${this.taxon_name}`;
  }

  _formatCritterCaptures(animal_captures: IAnimalCapture[]): ICapturesAndLocations {
    const formattedCaptures: ICritterCapture[] = [];
    const formattedLocations: ICritterLocation[] = [];
    animal_captures.forEach((capture) => {
      const cleanedCapture = omitBy(capture, (value) => value === '') as IAnimalCapture;
      const c_loc_id = v4();
      let r_loc_id: string | undefined = undefined;

      formattedLocations.push({
        location_id: c_loc_id,
        latitude: Number(capture.capture_latitude),
        longitude: Number(capture.capture_longitude),
        coordinate_uncertainty: Number(capture.capture_coordinate_uncertainty),
        coordinate_uncertainty_unit: 'm'
      });

      if (capture.release_latitude && capture.release_longitude) {
        r_loc_id = v4();

        formattedLocations.push({
          location_id: r_loc_id,
          latitude: Number(capture.release_latitude),
          longitude: Number(capture.release_longitude),
          coordinate_uncertainty: Number(capture.release_coordinate_uncertainty),
          coordinate_uncertainty_unit: 'm'
        });
      }

      formattedCaptures.push({
        critter_id: this.critter_id,
        capture_location_id: c_loc_id,
        release_location_id: r_loc_id,
        capture_timestamp: cleanedCapture.capture_timestamp,
        release_timestamp: cleanedCapture.release_timestamp,
        capture_comment: cleanedCapture.capture_comment,
        release_comment: cleanedCapture.release_comment
      });
    });

    return { captures: formattedCaptures, capture_locations: formattedLocations };
  }

  _formatCritterMortalities(animal_mortalities: IAnimalMortality[]): IMortalityAndLocation {
    const formattedMortalities: ICritterMortality[] = [];
    const formattedLocations: ICritterLocation[] = [];
    animal_mortalities.forEach((mortality) => {
      const cleanedMortality = omitBy(mortality, (value) => value === '') as IAnimalMortality;
      const loc_id = v4();

      formattedLocations.push({
        location_id: loc_id,
        latitude: Number(mortality.mortality_latitude),
        longitude: Number(mortality.mortality_latitude),
        coordinate_uncertainty: Number(mortality.mortality_latitude),
        coordinate_uncertainty_unit: 'm'
      });

      formattedMortalities.push({
        critter_id: this.critter_id,
        location_id: loc_id,
        mortality_timestamp: cleanedMortality.mortality_timestamp,
        mortality_comment: cleanedMortality.mortality_comment,
        mortality_pcod_taxon_id: cleanedMortality.mortality_pcod_taxon_id,
        mortality_pcod_reason: cleanedMortality.mortality_pcod_reason,
        mortality_pcod_confidence: cleanedMortality.mortality_pcod_confidence,
        mortality_ucod_reason: cleanedMortality.mortality_ucod_reason,
        mortality_ucod_confidence: cleanedMortality.mortality_ucod_confidence,
        mortality_ucod_taxon_id: cleanedMortality.mortality_ucod_taxon_id
      });
    });
    return { mortalities: formattedMortalities, mortalities_locations: formattedLocations };
  }

  _formatCritterMarkings(animal_markings: IAnimalMarking[]): ICritterMarking[] {
    return animal_markings.map((marking) => {
      const cleanedMarking = omitBy(marking, (value) => value === '') as IAnimalMarking;
      return {
        critter_id: this.critter_id,
        ...omit(cleanedMarking, '_id')
      };
    });
  }

  _formatCritterQualitativeMeasurements(animal_measurements: IAnimalMeasurement[]): ICritterQualitativeMeasurement[] {
    const filteredQualitativeMeasurements = animal_measurements.filter((measurement) => {
      if (measurement.qualitative_option_id && measurement.value) {
        console.log('Qualitative measurement must only contain option_id and no value.');
        return false;
      }
      return measurement.qualitative_option_id;
    });

    return filteredQualitativeMeasurements.map((qual_measurement) => ({
      critter_id: this.critter_id,
      taxon_measurement_id: qual_measurement.taxon_measurement_id,
      qualitative_option_id: qual_measurement.qualitative_option_id,
      measured_timestamp: qual_measurement.measured_timestamp || undefined,
      measurement_comment: qual_measurement.measurement_comment || undefined
    }));
  }

  _formatCritterQuantitativeMeasurements(animal_measurements: IAnimalMeasurement[]): ICritterQuantitativeMeasurement[] {
    const filteredQuantitativeMeasurements = animal_measurements.filter((measurement) => {
      if (measurement.qualitative_option_id && measurement.value) {
        console.log('Quantitative measurement must only contain a value and no qualitative_option_id');
        return false;
      }
      return measurement.value;
    });
    return filteredQuantitativeMeasurements.map((quant_measurement) => {
      return {
        critter_id: this.critter_id,
        taxon_measurement_id: quant_measurement.taxon_measurement_id,
        value: Number(quant_measurement.value),
        measured_timestamp: quant_measurement.measured_timestamp || undefined,
        measurement_comment: quant_measurement.measurement_comment || undefined
      };
    });
  }

  _formatCritterFamilyRelationships(animal_family: IAnimalRelationship[]): ICritterRelationships {
    let newFamily = undefined;
    const families: ICritterFamily[] = [];
    for (const fam of animal_family) {
      if (fam.family_id === newFamilyIdPlaceholder) {
        if (!newFamily) {
          newFamily = { family_id: v4(), family_label: this.name + '_family' };
          families.push(newFamily);
        }
        fam.family_id = newFamily.family_id;
      }
    }

    const parents = animal_family
      .filter((parent) => parent.relationship === 'parent')
      .map((parent_fam) => ({ family_id: parent_fam.family_id, parent_critter_id: this.critter_id }));

    const children = animal_family
      .filter((children) => children.relationship === 'child')
      .map((children_fam) => ({ family_id: children_fam.family_id, child_critter_id: this.critter_id }));
    //Currently not supporting siblings in the UI
    return { parents, children, families };
  }

  constructor(animal: IAnimal) {
    this.critter_id = v4();
    this.taxon_id = animal.general.taxon_id;
    this.taxon_name = animal.general.taxon_name;
    this.animal_id = animal.general.animal_id;
    const { captures, capture_locations } = this._formatCritterCaptures(animal.captures);
    const { mortalities, mortalities_locations } = this._formatCritterMortalities(animal.mortality);

    this.captures = captures;
    this.mortalities = mortalities;
    this.locations = [...capture_locations, ...mortalities_locations];

    this.markings = this._formatCritterMarkings(animal.markings);

    this.measurements = {
      qualitative: this._formatCritterQualitativeMeasurements(animal.measurements),
      quantitative: this._formatCritterQuantitativeMeasurements(animal.measurements)
    };

    const { parents, children, families } = this._formatCritterFamilyRelationships(animal.family);
    this.families = { parents, children, families };
  }
}