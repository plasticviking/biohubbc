import { FormControl, FormControlProps, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { useFormikContext } from 'formik';
import { ICbRouteKey } from 'hooks/cb_api/useLookupApi';
import { useCritterbaseApi } from 'hooks/useCritterbaseApi';
import useDataLoader from 'hooks/useDataLoader';
import get from 'lodash-es/get';
import React from 'react';

export interface ICbSelectField {
  name: string;
  label: string;
  id: string;
  route: ICbRouteKey;
  controlProps?: FormControlProps;
}

interface ICbSelectOption {
  value: string | number;
  label: string;
}

const CbSelectField: React.FC<ICbSelectField> = (props) => {
  const api = useCritterbaseApi();
  const cbLookupLoader = useDataLoader(async () => api.lookup.getSelectOptions(props.route));
  const { values, touched, errors, handleChange, handleBlur } = useFormikContext<ICbSelectOption>();

  const err = get(touched, props.name) && get(errors, props.name);

  if (!cbLookupLoader.data) {
    cbLookupLoader.load();
  }

  return (
    <FormControl variant="outlined" fullWidth {...props.controlProps} error={!!err}>
      <InputLabel id={`${props.name}-label`}>{props.label}</InputLabel>
      <Select
        name={props.name}
        labelId="cb_select"
        label={props.label}
        value={get(values, props.name) ?? ''}
        onChange={handleChange}
        onBlur={handleBlur}
        displayEmpty
        inputProps={{ 'aria-label': 'Permit Type' }}>
        {cbLookupLoader.data?.map((a) => {
          const item =
            typeof a === 'string' ? { label: a, value: a } : { label: a.value, value: a.id, subtext: 'Subtext' };
          return (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          );
        })}
      </Select>
      <FormHelperText>{err}</FormHelperText>
    </FormControl>
  );
};

export default CbSelectField;