import { Checkbox, FormControlLabel, Grid } from '@mui/material';
import CustomTextField from 'components/fields/CustomTextField';
import SingleDateField from 'components/fields/SingleDateField';
import { SurveyAnimalsI18N } from 'constants/i18n';
import { Field, FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import React, { Fragment, useState } from 'react';
import { v4 } from 'uuid';
import { AnimalCaptureSchema, getAnimalFieldName, IAnimal, IAnimalCapture, isRequiredInSchema } from '../animal';
import TextInputToggle from '../TextInputToggle';
import FormSectionWrapper from './FormSectionWrapper';
import LocationEntryForm from './LocationEntryForm';
/**
 * Renders the Capture section for the Individual Animal form
 *
 * Note A: Using <FieldArray/> the name properties must stay in sync with
 * values object and nested arrays.
 * ie: values = { capture: [{id: 'test'}] };  name = 'capture.[0].id';
 *
 * Note B: FormSectionWrapper uses a Grid container to render children elements.
 * Children of FormSectionWrapper can use Grid items to organize inputs.
 *
 * @return {*}
 */

type ProjectionMode = 'wgs' | 'utm';
const CaptureAnimalForm = () => {
  const { values } = useFormikContext<IAnimal>();

  const name: keyof IAnimal = 'captures';
  const newCapture: IAnimalCapture = {
    _id: v4(),

    capture_latitude: '' as unknown as number,
    capture_longitude: '' as unknown as number,
    capture_utm_northing: '' as unknown as number,
    capture_utm_easting: '' as unknown as number,
    capture_comment: '',
    capture_coordinate_uncertainty: 10,
    capture_timestamp: '' as unknown as Date,
    projection_mode: 'wgs' as ProjectionMode,
    show_release: false,
    release_latitude: '' as unknown as number,
    release_longitude: '' as unknown as number,
    release_utm_northing: '' as unknown as number,
    release_utm_easting: '' as unknown as number,
    release_comment: '',
    release_timestamp: '' as unknown as Date,
    release_coordinate_uncertainty: 10
  };

  const canAddNewCapture = () => {
    const lastCapture = values.captures[values.captures.length - 1];
    if (!lastCapture) {
      return true;
    }
    const { capture_latitude, capture_longitude, capture_timestamp, capture_coordinate_uncertainty } = lastCapture;
    return capture_latitude && capture_longitude && capture_timestamp && capture_coordinate_uncertainty;
  };

  return (
    <FieldArray name={name}>
      {({ remove, push }: FieldArrayRenderProps) => (
        <>
          <FormSectionWrapper
            title={SurveyAnimalsI18N.animalCaptureTitle}
            addedSectionTitle={SurveyAnimalsI18N.animalCaptureTitle2}
            titleHelp={SurveyAnimalsI18N.animalCaptureHelp}
            btnLabel={SurveyAnimalsI18N.animalCaptureAddBtn}
            disableAddBtn={!canAddNewCapture()}
            handleAddSection={() => push(newCapture)}
            handleRemoveSection={remove}>
            {values.captures.map((cap, index) => (
              <CaptureAnimalFormContent key={cap._id} name={name} index={index} value={cap} />
            ))}
          </FormSectionWrapper>
        </>
      )}
    </FieldArray>
  );
};

interface CaptureAnimalFormContentProps {
  name: keyof IAnimal;
  index: number;
  value: IAnimalCapture;
}

const CaptureAnimalFormContent = ({ name, index, value }: CaptureAnimalFormContentProps) => {
  const { handleBlur, values, handleChange } = useFormikContext<IAnimal>();
  const [showCaptureComment, setShowCaptureComment] = useState(false);
  const [showReleaseComment, setShowReleaseComment] = useState(false);

  const showReleaseSection = values.captures[index].show_release;

  const renderCaptureFields = (): JSX.Element => {
    return (
      <Fragment key={'capture-fields'}>
        <Grid item xs={6}>
          <SingleDateField
            name={getAnimalFieldName<IAnimalCapture>(name, 'capture_timestamp', index)}
            required={true}
            label={'Capture Date'}
            other={{ size: 'small' }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextInputToggle
            toggleProps={{ handleToggle: () => setShowCaptureComment((c) => !c), toggleState: showCaptureComment }}
            label="Add comment about this Capture">
            <CustomTextField
              other={{ size: 'small', required: isRequiredInSchema(AnimalCaptureSchema, 'capture_comment') }}
              label="Capture Comment"
              name={getAnimalFieldName<IAnimalCapture>(name, 'capture_comment', index)}
              handleBlur={handleBlur}
            />
          </TextInputToggle>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Field
                as={Checkbox}
                onChange={handleChange}
                name={getAnimalFieldName<IAnimalCapture>(name, 'show_release', index)}
              />
            }
            label={SurveyAnimalsI18N.animalCaptureReleaseRadio}
          />
        </Grid>
      </Fragment>
    );
  };

  const renderReleaseFields = (): JSX.Element => {
    return (
      <Fragment key={`capture-release-fields`}>
        <Grid item xs={6}>
          <SingleDateField
            name={getAnimalFieldName<IAnimalCapture>(name, 'release_timestamp', index)}
            required={true}
            label={'Release Date'}
            other={{ size: 'small' }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextInputToggle
            label="Add comment about this Release"
            toggleProps={{ handleToggle: () => setShowReleaseComment((c) => !c), toggleState: showReleaseComment }}>
            <CustomTextField
              other={{ size: 'small', required: isRequiredInSchema(AnimalCaptureSchema, 'release_comment') }}
              label="Release Comment"
              name={getAnimalFieldName<IAnimalCapture>(name, 'release_comment', index)}
              handleBlur={handleBlur}
            />
          </TextInputToggle>
        </Grid>
      </Fragment>
    );
  };

  return (
    <LocationEntryForm
      name={name}
      index={index}
      value={value}
      primaryLocationFields={{
        latitude: 'capture_latitude',
        longitude: 'capture_longitude',
        coordinate_uncertainty: 'capture_coordinate_uncertainty',
        utm_northing: 'capture_utm_northing',
        utm_easting: 'capture_utm_easting'
      }}
      secondaryLocationFields={
        showReleaseSection
          ? {
              latitude: 'release_latitude',
              longitude: 'release_longitude',
              coordinate_uncertainty: 'release_coordinate_uncertainty',
              utm_northing: 'release_utm_northing',
              utm_easting: 'release_utm_easting'
            }
          : undefined
      }
      otherPrimaryFields={[renderCaptureFields()]}
      otherSecondaryFields={[renderReleaseFields()]}
    />
  );
};

export default CaptureAnimalForm;