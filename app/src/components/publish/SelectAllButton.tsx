import { Box, makeStyles, Theme } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import { useFormikContext } from 'formik';
import React, { useEffect } from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  subHeader: {
    width: '100%',
    backgroundColor: '#dadada',
    opacity: '.5'
  },
  results: {
    width: '100%',
    textTransform: 'uppercase'
  }
}));

export interface ISelectAllButtonProps {
  formikData: { key: string; value: any }[];
}

const SelectAllButton: React.FC<ISelectAllButtonProps> = (props) => {
  const classes = useStyles();

  const [selected, setSelected] = React.useState(false);

  const { formikData } = props;
  const { resetForm, setFieldValue, values } = useFormikContext<any>();

  useEffect(() => {
    formikData.forEach((item) => {
      if (values[item.key] !== item.value) {
        setSelected(false);
      }
    });
  }, [formikData, values]);

  const handleAll = () => {
    formikData.forEach((item) => {
      setFieldValue(item.key, item.value);
    });
  };

  return (
    <>
      <Box className={classes.results} pl={2} py={2}>
        <Checkbox
          checked={selected}
          onChange={() => {
            if (selected) {
              resetForm();
              setSelected(false);
            } else {
              handleAll();
              setSelected(true);
            }
          }}
          name={`select-all`}
          color="primary"></Checkbox>
        Select All
      </Box>
    </>
  );
};

export default SelectAllButton;