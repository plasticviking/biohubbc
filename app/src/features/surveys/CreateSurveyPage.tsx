import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import { ErrorDialog, IErrorDialogProps } from 'components/dialog/ErrorDialog';
import YesNoDialog from 'components/dialog/YesNoDialog';
import { CreateSurveyI18N } from 'constants/i18n';
import { Formik, FormikProps } from 'formik';
import { useBiohubApi } from 'hooks/useBioHubApi';
import { IGetAllCodeSetsResponse } from 'interfaces/useCodesApi.interface';
import { IGetProjectForViewResponse, ICreateProjectSurveyRequest } from 'interfaces/useProjectApi.interface';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Prompt, useHistory, useParams } from 'react-router';
import { validateFormFieldsAndReportCompletion } from 'utils/customValidation';
import AgreementsForm, { AgreementsInitialValues, AgreementsYupSchema } from './components/AgreementsForm';
import GeneralInformationForm, {
  GeneralInformationInitialValues,
  GeneralInformationYupSchema
} from './components/GeneralInformationForm';
import ProprietaryDataForm, {
  ProprietaryDataInitialValues,
  ProprietaryDataYupSchema
} from './components/ProprietaryDataForm';
import StudyAreaForm, { StudyAreaInitialValues, StudyAreaYupSchema } from './components/StudyAreaForm';
import CreateSurveySection from './CreateSurveySection';
import * as History from 'history';
import { APIError } from 'hooks/api/useAxios';

const useStyles = makeStyles((theme: Theme) => ({
  actionButton: {
    minWidth: '6rem',
    '& + button': {
      marginLeft: '0.5rem'
    }
  },
  breadCrumbLink: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  breadCrumbLinkIcon: {
    marginRight: '0.25rem'
  },
  finishContainer: {
    padding: theme.spacing(3),
    backgroundColor: 'transparent'
  },
  surveySection: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(5),

    '&:last-child': {
      marginBottom: 0
    },
    '&:first-child': {
      marginTop: 0
    }
  },
  sectionDivider: {
    height: '1px'
  }
}));

/**
 * Page to create a survey.
 *
 * @return {*}
 */
const CreateSurveyPage = () => {
  const urlParams = useParams();
  const classes = useStyles();
  const biohubApi = useBiohubApi();
  const history = useHistory();

  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [projectWithDetails, setProjectWithDetails] = useState<IGetProjectForViewResponse | null>(null);
  const [isLoadingCodes, setIsLoadingCodes] = useState(false);
  const [codes, setCodes] = useState<IGetAllCodeSetsResponse>();
  const [formikRef] = useState(useRef<FormikProps<any>>(null));

  // Whether or not to show the 'Are you sure you want to cancel' dialog
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  // Ability to bypass showing the 'Are you sure you want to cancel' dialog
  const [enableCancelCheck, setEnableCancelCheck] = useState(true);

  // Whether or not to show the error dialog
  const [openErrorDialogProps, setOpenErrorDialogProps] = useState<IErrorDialogProps>({
    dialogTitle: CreateSurveyI18N.createErrorTitle,
    dialogText: CreateSurveyI18N.createErrorText,
    open: false,
    onClose: () => {
      setOpenErrorDialogProps({ ...openErrorDialogProps, open: false });
    },
    onOk: () => {
      setOpenErrorDialogProps({ ...openErrorDialogProps, open: false });
    }
  });

  // Initial values for the survey form sections
  const [surveyInitialValues] = useState({
    ...GeneralInformationInitialValues,
    ...StudyAreaInitialValues,
    ...ProprietaryDataInitialValues,
    ...AgreementsInitialValues
  });

  // Yup schemas for the survey form sections
  const surveyYupSchemas = GeneralInformationYupSchema.concat(StudyAreaYupSchema)
    .concat(ProprietaryDataYupSchema)
    .concat(AgreementsYupSchema);

  useEffect(() => {
    const getCodes = async () => {
      const codesResponse = await biohubApi.codes.getAllCodeSets();

      if (!codesResponse) {
        // TODO error handling/messaging
        return;
      }

      setCodes(codesResponse);
    };

    if (!isLoadingCodes && !codes) {
      getCodes();
      setIsLoadingCodes(true);
    }
  }, [urlParams, biohubApi.codes, isLoadingCodes, codes]);

  const getProject = useCallback(async () => {
    const projectWithDetailsResponse = await biohubApi.project.getProjectForView(urlParams['id']);

    if (!projectWithDetailsResponse) {
      // TODO error handling/messaging
      return;
    }

    setProjectWithDetails(projectWithDetailsResponse);
  }, [biohubApi.project, urlParams]);

  useEffect(() => {
    if (!isLoadingProject && !projectWithDetails) {
      getProject();
      setIsLoadingProject(true);
    }
  }, [isLoadingProject, projectWithDetails, getProject]);

  const handleCancel = () => {
    history.push(`/projects/${projectWithDetails?.id}/surveys`);
  };

  const showCreateErrorDialog = (textDialogProps?: Partial<IErrorDialogProps>) => {
    setOpenErrorDialogProps({
      ...openErrorDialogProps,
      dialogTitle: CreateSurveyI18N.createErrorTitle,
      dialogText: CreateSurveyI18N.createErrorText,
      ...textDialogProps,
      open: true
    });
  };

  /**
   * Creates a new project survey record
   *
   * @param {ICreateProjectSurveyRequest} surveyPostObject
   * @return {*}
   */
  const createSurvey = async (surveyPostObject: ICreateProjectSurveyRequest) => {
    const response = await biohubApi.project.createSurvey(Number(projectWithDetails?.id), surveyPostObject);

    if (!response?.id) {
      showCreateErrorDialog({ dialogError: 'The response from the server was null, or did not contain a survey ID.' });
      return;
    }

    return response;
  };

  /**
   * Handle creation of surveys.
   */
  const handleSubmit = async () => {
    if (!formikRef?.current) {
      return;
    }

    await formikRef.current?.submitForm();

    const isValid = await validateFormFieldsAndReportCompletion(
      formikRef.current?.values,
      formikRef.current?.validateForm
    );

    if (!isValid) {
      showCreateErrorDialog({
        dialogTitle: 'Create Survey Form Incomplete',
        dialogText:
          'The form is missing some required fields/sections highlighted in red. Please fill them out and try again.'
      });

      return;
    }

    try {
      const response = await createSurvey(formikRef.current?.values);

      if (!response) {
        return;
      }

      setEnableCancelCheck(false);

      history.push(`/projects/${projectWithDetails?.id}/surveys`);
    } catch (error) {
      const apiError = error as APIError;
      showCreateErrorDialog({
        dialogTitle: 'Error Creating Survey',
        dialogError: apiError?.message,
        dialogErrorDetails: apiError?.errors
      });
    }
  };

  // Used for when the user tries to leave the create survey page (cancel click or browser back button click)
  const handleLocationChange = (location: History.Location, action: History.Action) => {
    if (!openCancelDialog) {
      // If the cancel dialog is not open: open it
      setOpenCancelDialog(true);
      return false;
    }

    // If the cancel dialog is already open and a location change action is triggered by `handleDialogYes`: allow it
    return true;
  };

  if (!codes || !projectWithDetails) {
    return <CircularProgress className="pageProgress" size={40} />;
  }

  return (
    <>
      <Prompt when={enableCancelCheck} message={handleLocationChange} />
      <YesNoDialog
        dialogTitle={CreateSurveyI18N.cancelTitle}
        dialogText={CreateSurveyI18N.cancelText}
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
        onNo={() => setOpenCancelDialog(false)}
        onYes={() => history.push(`/projects/${projectWithDetails?.id}/surveys`)}
      />
      <ErrorDialog {...openErrorDialogProps} />
      <Box my={3}>
        <Container maxWidth="xl">
          <Box mb={3}>
            <Breadcrumbs>
              <Link color="primary" onClick={handleCancel} aria-current="page" className={classes.breadCrumbLink}>
                <Typography variant="body2">{projectWithDetails.project.project_name}</Typography>
              </Link>
              <Typography variant="body2">Create Survey</Typography>
            </Breadcrumbs>
          </Box>

          <Box mb={3}>
            <Typography variant="h1">Create Survey</Typography>
          </Box>
          <Box mb={5}>
            <Typography variant="body1">
              Lorem Ipsum dolor sit amet, consecteur, Lorem Ipsum dolor sit amet, consecteur. Lorem Ipsum dolor sit
              amet, consecteur. Lorem Ipsum dolor sit amet, consecteur. Lorem Ipsum dolor sit amet, consecteur
            </Typography>
          </Box>
          <Box component={Paper} display="block">
            <Formik
              innerRef={formikRef}
              initialValues={surveyInitialValues}
              validationSchema={surveyYupSchemas}
              validateOnBlur={true}
              validateOnChange={false}
              onSubmit={() => {}}>
              <>
                <CreateSurveySection
                  title="General Information"
                  summary="General Information Summary (to be completed)"
                  component={
                    <GeneralInformationForm
                      species={
                        codes?.species?.map((item) => {
                          return { value: item.name, label: item.name };
                        }) || []
                      }
                    />
                  }></CreateSurveySection>
                <Divider className={classes.sectionDivider} />

                <CreateSurveySection
                  title="Study Area"
                  summary="Study Area Summary (to be completed)"
                  component={
                    <StudyAreaForm
                      park={[
                        { value: 'Park name 1', label: 'Park name 1' },
                        { value: 'Park name 2', label: 'Park name 2' }
                      ]}
                      management_unit={[
                        { value: 'Management unit 1', label: 'Management unit 1' },
                        { value: 'Management unit 2', label: 'Management unit 2' }
                      ]}
                    />
                  }></CreateSurveySection>
                <Divider className={classes.sectionDivider} />

                <CreateSurveySection
                  title="Proprietary Data"
                  summary="Proprietary Data Summary (to be completed)"
                  component={
                    <ProprietaryDataForm
                      proprietary_data_category={
                        codes?.proprietor_type?.map((item) => {
                          return { value: item.id, label: item.name };
                        }) || []
                      }
                      first_nations={
                        codes?.first_nations?.map((item) => {
                          return { value: item.id, label: item.name };
                        }) || []
                      }
                    />
                  }></CreateSurveySection>
                <Divider className={classes.sectionDivider} />

                <CreateSurveySection
                  title="Agreements"
                  summary="Agreements Summary (to be completed)"
                  component={<AgreementsForm />}></CreateSurveySection>
                <Divider className={classes.sectionDivider} />
              </>
            </Formik>
            <Box p={3} display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                className={classes.actionButton}>
                Save and Exit
              </Button>
              <Button variant="outlined" color="primary" onClick={handleCancel} className={classes.actionButton}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CreateSurveyPage;