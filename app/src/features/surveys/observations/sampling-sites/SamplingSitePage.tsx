import { LoadingButton } from '@mui/lab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { grey } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { Container } from '@mui/system';
import { IErrorDialogProps } from 'components/dialog/ErrorDialog';
import HorizontalSplitFormComponent from 'components/fields/HorizontalSplitFormComponent';
import { CreateSamplingSiteI18N } from 'constants/i18n';
import { DialogContext } from 'contexts/dialogContext';
import { SurveyContext } from 'contexts/surveyContext';
import { ISurveySampleMethodData, SamplingSiteMethodYupSchema } from 'features/surveys/components/MethodForm';
import SamplingMethodForm from 'features/surveys/components/SamplingMethodForm';
import SurveySamplingSiteImportForm from 'features/surveys/components/SurveySamplingSiteImportForm';
import { Formik, FormikProps } from 'formik';
import { Feature } from 'geojson';
import History from 'history';
import { APIError } from 'hooks/api/useAxios';
import { useBiohubApi } from 'hooks/useBioHubApi';
import { useContext, useRef, useState } from 'react';
import { Prompt, useHistory } from 'react-router';
import yup from 'utils/YupSchema';
import SamplingSiteHeader from './SamplingSiteHeader';

const useStyles = makeStyles((theme: Theme) => ({
  actionButton: {
    minWidth: '6rem',
    '& + button': {
      marginLeft: '0.5rem'
    }
  },
  sectionDivider: {
    height: '1px',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5)
  }
}));

export interface ISurveySampleSite {
  name: string;
  description: string;
  feature: Feature;
}

export interface ICreateSamplingSiteRequest {
  survey_id: number;
  survey_sample_sites: ISurveySampleSite[]; // extracted list from shape files
  methods: ISurveySampleMethodData[];
}

const SamplingSitePage = () => {
  const classes = useStyles();
  const history = useHistory();
  const biohubApi = useBiohubApi();

  const surveyContext = useContext(SurveyContext);
  const dialogContext = useContext(DialogContext);

  const [formikRef] = useState(useRef<FormikProps<any>>(null));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [enableCancelCheck, setEnableCancelCheck] = useState(true);

  if (!surveyContext.surveyDataLoader.data) {
    return <CircularProgress className="pageProgress" size={40} />;
  }

  const samplingSiteYupSchema = yup.object({
    survey_sample_sites: yup
      .array(
        yup.object({ name: yup.string().default(''), description: yup.string().default(''), feature: yup.object({}) })
      )
      .min(1, 'At least one sampling site location is required'),
    methods: yup
      .array(yup.object().concat(SamplingSiteMethodYupSchema))
      .min(1, 'At least one sampling method is required')
  });

  const showCreateErrorDialog = (textDialogProps?: Partial<IErrorDialogProps>) => {
    dialogContext.setErrorDialog({
      dialogTitle: CreateSamplingSiteI18N.createErrorTitle,
      dialogText: CreateSamplingSiteI18N.createErrorText,
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

  const handleSubmit = async (values: ICreateSamplingSiteRequest) => {
    try {
      setIsSubmitting(true);

      await biohubApi.samplingSite.createSamplingSites(surveyContext.projectId, surveyContext.surveyId, values);

      // Disable cancel prompt so we can navigate away from the page after saving
      setEnableCancelCheck(false);

      // Refresh the context, so the next page loads with the latest data
      surveyContext.sampleSiteDataLoader.refresh(surveyContext.projectId, surveyContext.surveyId);

      // create complete, navigate back to observations page
      history.push(`/admin/projects/${surveyContext.projectId}/surveys/${surveyContext.surveyId}/observations`);
    } catch (error) {
      showCreateErrorDialog({
        dialogTitle: CreateSamplingSiteI18N.createErrorTitle,
        dialogText: CreateSamplingSiteI18N.createErrorText,
        dialogError: (error as APIError).message,
        dialogErrorDetails: (error as APIError)?.errors
      });
      setIsSubmitting(false);
    }
  };

  /**
   * Intercepts all navigation attempts (when used with a `Prompt`).
   *
   * Returning true allows the navigation, returning false prevents it.
   *
   * @param {History.Location} location
   * @return {*}
   */
  const handleLocationChange = (location: History.Location, action: History.Action) => {
    if (!dialogContext.yesNoDialogProps.open) {
      // If the cancel dialog is not open: open it
      dialogContext.setYesNoDialog({
        open: true,
        dialogTitle: CreateSamplingSiteI18N.cancelTitle,
        dialogText: CreateSamplingSiteI18N.cancelText,
        onClose: () => {
          dialogContext.setYesNoDialog({ open: false });
        },
        onNo: () => {
          dialogContext.setYesNoDialog({ open: false });
        },
        onYes: () => {
          dialogContext.setYesNoDialog({ open: false });
          history.push(location.pathname);
        }
      });
      return false;
    }

    // If the cancel dialog is already open and another location change action is triggered: allow it
    return true;
  };

  return (
    <>
      <Prompt when={enableCancelCheck} message={handleLocationChange} />

      <Formik
        innerRef={formikRef}
        initialValues={{
          survey_id: surveyContext.surveyId,
          name: '',
          description: '',
          survey_sample_sites: [],
          methods: []
        }}
        validationSchema={samplingSiteYupSchema}
        validateOnBlur={true}
        validateOnChange={false}
        onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" height="100%">
          <Box
            position="sticky"
            top="0"
            zIndex={1001}
            sx={{
              borderBottomStyle: 'solid',
              borderBottomWidth: '1px',
              borderBottomColor: grey[300]
            }}>
            <SamplingSiteHeader
              project_id={surveyContext.projectId}
              survey_id={surveyContext.surveyId}
              survey_name={surveyContext.surveyDataLoader.data.surveyData.survey_details.survey_name}
              is_submitting={isSubmitting}
              title="Add Sampling Site"
              breadcrumb="Add Sampling Sites"
            />
          </Box>
          <Box display="flex" flex="1 1 auto">
            <Container maxWidth="xl">
              <Box py={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 5
                  }}>
                  <HorizontalSplitFormComponent
                    title="Site Location"
                    summary="Import or draw sampling site locations used for this survey."
                    component={<SurveySamplingSiteImportForm />}></HorizontalSplitFormComponent>

                  <Divider className={classes.sectionDivider} />

                  <HorizontalSplitFormComponent
                    title="Sampling Methods"
                    summary="Specify sampling methods that were used to collect data."
                    component={<SamplingMethodForm />}></HorizontalSplitFormComponent>

                  <Divider className={classes.sectionDivider} />

                  <Box display="flex" justifyContent="flex-end">
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      color="primary"
                      loading={isSubmitting}
                      onClick={() => {
                        formikRef.current?.submitForm();
                      }}
                      className={classes.actionButton}>
                      Save and Exit
                    </LoadingButton>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        history.push(
                          `/admin/projects/${surveyContext.projectId}/surveys/${surveyContext.surveyId}/observations`
                        );
                      }}
                      className={classes.actionButton}>
                      Cancel
                    </Button>
                  </Box>
                </Paper>
              </Box>
            </Container>
          </Box>
        </Box>
      </Formik>
    </>
  );
};

export default SamplingSitePage;
