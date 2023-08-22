import { SurveyAnimalsI18N } from 'constants/i18n';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import React, { Fragment } from 'react';
import { v4 } from 'uuid';
import { IAnimal, IAnimalImage } from '../animal';
import FormSectionWrapper from './FormSectionWrapper';

const ImageAnimalForm = () => {
  const { values } = useFormikContext<IAnimal>();

  const name: keyof IAnimal = 'images';
  const newImage: IAnimalImage = {
    _id: v4()
  };

  return (
    <FieldArray name={name}>
      {({ remove, push }: FieldArrayRenderProps) => {
        <>
          <FormSectionWrapper
            title={SurveyAnimalsI18N.animalImagesTitle}
            addedSectionTitle={SurveyAnimalsI18N.animalImagesTitle2}
            titleHelp={SurveyAnimalsI18N.animalImagesHelp}
            btnLabel={SurveyAnimalsI18N.animalImagesAddBtn}
            disableAddBtn={false}
            handleAddSection={() => push(newImage)}
            handleRemoveSection={remove}>
            {values?.images?.map((image, index) => (
              <Fragment key={image._id}></Fragment>
            ))}
          </FormSectionWrapper>
        </>;
      }}
    </FieldArray>
  );
};

export default ImageAnimalForm;
