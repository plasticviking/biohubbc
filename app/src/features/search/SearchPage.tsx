import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/styles/makeStyles';
import SearchAdvancedFilters, {
  ISearchAdvancedFilters,
  SearchAdvancedFiltersInitialValues
} from 'components/search-filter/SearchAdvancedFilters';
import { Formik, FormikProps } from 'formik';
import React, { useRef, useState, useContext } from 'react';
import { useBiohubApi } from 'hooks/useBioHubApi';
import { Feature } from 'geojson';
import { APIError } from 'hooks/api/useAxios';
import { IErrorDialogProps } from 'components/dialog/ErrorDialog';
import { DialogContext } from 'contexts/dialogContext';
import { generateValidGeometryCollection, updateMapBounds } from 'utils/mapBoundaryUploadHelpers';
import { SearchFeaturePopup } from 'components/map/SearchFeaturePopup';
import { INonEditableGeometries } from 'components/map/MapContainer';

const useStyles = makeStyles({
  actionButton: {
    minWidth: '6rem',
    '& + button': {
      marginLeft: '0.5rem'
    }
  }
});

/**
 * Page to search for and display a list of records spatially.
 *
 * @return {*}
 */
const SearchPage: React.FC = () => {
  const classes = useStyles();
  const biohubApi = useBiohubApi();

  const [formikRef] = useState(useRef<FormikProps<any>>(null));
  const [geometries, setGeometries] = useState<INonEditableGeometries[]>([]);
  const [bounds, setBounds] = useState<any[]>([]);

  const dialogContext = useContext(DialogContext);

  const showFilterErrorDialog = (textDialogProps?: Partial<IErrorDialogProps>) => {
    dialogContext.setErrorDialog({
      onClose: () => {
        dialogContext.setErrorDialog({ open: false });
      },
      onOk: () => {
        dialogContext.setErrorDialog({ open: false });
      },
      ...textDialogProps,
      open: true
    });
  };

  const handleSubmit = async () => {
    if (!formikRef?.current) {
      return;
    }

    formikRef.current.handleReset();

    await getSearchResults(formikRef.current.values);
  };

  const getSearchResults = async (values: ISearchAdvancedFilters) => {
    try {
      const response = await biohubApi.search.getSearchResults(values);

      if (!response) {
        return;
      }

      let nonEditableGeometries: INonEditableGeometries[] = [];
      let geos: Feature[] = [];

      response.forEach((result: any) => {
        const feature = generateValidGeometryCollection(result.geometry, result.id).geometryCollection[0];

        nonEditableGeometries.push({
          feature,
          popupComponent: <SearchFeaturePopup featureData={result} />
        });

        geos.push(feature);
      });

      if (geos.length) {
        updateMapBounds(geos, setBounds);
      }

      setGeometries(nonEditableGeometries);
    } catch (error) {
      const apiError = error as APIError;
      showFilterErrorDialog({
        dialogTitle: 'Error Searching For Results',
        dialogError: apiError?.message,
        dialogErrorDetails: apiError?.errors
      });
    }
  };

  /**
   * Displays search results visualized on a map spatially.
   */
  return (
    <Box my={4}>
      <Container maxWidth="xl">
        <Box mb={5} display="flex" justifyContent="space-between">
          <Typography variant="h1">Search</Typography>
        </Box>
        <Box>
          <Box mb={4}>
            <Formik innerRef={formikRef} initialValues={SearchAdvancedFiltersInitialValues} onSubmit={handleSubmit}>
              <SearchAdvancedFilters geometryResult={geometries} setBoundsResult={setBounds} boundsResult={bounds} />
            </Formik>
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button
                className={classes.actionButton}
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleSubmit}>
                Search
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SearchPage;