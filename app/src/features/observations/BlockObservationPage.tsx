import HotTable from '@handsontable/react';
import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Formik, FormikProps } from 'formik';
import React, { useRef, useState, useContext, useCallback, useEffect } from 'react';
import BlockObservationForm, {
  BlockObservationInitialValues,
  BlockObservationYupSchema,
  IBlockObservationForm
} from './components/BlockObservationForm';
import { Prompt, useHistory, useParams } from 'react-router';
import { DialogContext } from 'contexts/dialogContext';
import { AddBlockObservationI18N } from 'constants/i18n';
import * as History from 'history';
import { useBiohubApi } from 'hooks/useBioHubApi';
import { IGetProjectForViewResponse } from 'interfaces/useProjectApi.interface';
import CircularProgress from '@material-ui/core/CircularProgress';
import { IGetSurveyForViewResponse } from 'interfaces/useSurveyApi.interface';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(() => ({
  breadCrumbLink: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  actionButton: {
    minWidth: '6rem',
    '& + button': {
      marginLeft: '0.5rem'
    }
  }
}));

const BlockObservationPage = () => {
  const classes = useStyles();
  const urlParams = useParams();
  const history = useHistory();
  const biohubApi = useBiohubApi();

  const dialogContext = useContext(DialogContext);

  const hotRef = useRef<HotTable>(null);
  const [formikRef] = useState(useRef<FormikProps<any>>(null));

  // Ability to bypass showing the 'Are you sure you want to cancel' dialog
  const [enableCancelCheck] = useState(true);
  const [tableData, setTableData] = useState<any[][]>([[, , , , , , , , , , , , , ,]]);

  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [isLoadingSurvey, setIsLoadingSurvey] = useState(true);
  const [isLoadingObservation, setIsLoadingObservation] = useState(true);
  const [projectWithDetails, setProjectWithDetails] = useState<IGetProjectForViewResponse | null>(null);
  const [surveyWithDetails, setSurveyWithDetails] = useState<IGetSurveyForViewResponse | null>(null);
  const [observationWithDetails, setObservationWithDetails] = useState<IBlockObservationForm>(
    BlockObservationInitialValues
  );

  const projectId = urlParams['id'];
  const surveyId = urlParams['survey_id'];
  const observationId = urlParams['observation_id'];

  const getProject = useCallback(async () => {
    const projectWithDetailsResponse = await biohubApi.project.getProjectForView(projectId);

    if (!projectWithDetailsResponse) {
      return;
    }

    setProjectWithDetails(projectWithDetailsResponse);
  }, [biohubApi.project, urlParams]);

  const getSurvey = useCallback(async () => {
    const surveyWithDetailsResponse = await biohubApi.survey.getSurveyForView(projectId, surveyId);

    if (!surveyWithDetailsResponse) {
      return;
    }
    setSurveyWithDetails(surveyWithDetailsResponse);
  }, [biohubApi.survey, urlParams]);

  const getObservation = useCallback(async () => {
    const observationWithDetailsResponse = await biohubApi.observation.getObservationForUpdate(
      projectId,
      surveyId,
      observationId,
      'block'
    );

    if (!observationWithDetailsResponse || !observationWithDetailsResponse.data) {
      return;
    }

    setObservationWithDetails(observationWithDetailsResponse.data.metaData);
    setTableData(observationWithDetailsResponse.data.tableData);
  }, [biohubApi.observation, urlParams]);

  useEffect(() => {
    if (isLoadingProject && !projectWithDetails) {
      getProject();
      setIsLoadingProject(false);
    }
  }, [isLoadingProject, projectWithDetails, getProject]);

  useEffect(() => {
    if (isLoadingSurvey && !surveyWithDetails) {
      getSurvey();
      setIsLoadingSurvey(false);
    }
  }, [isLoadingSurvey, surveyWithDetails, getSurvey]);

  useEffect(() => {
    if (isLoadingObservation && observationId) {
      getObservation();
      setIsLoadingObservation(false);
    }
  }, [observationId, isLoadingObservation, observationWithDetails, getObservation]);

  const defaultCancelDialogProps = {
    dialogTitle: AddBlockObservationI18N.cancelTitle,
    dialogText: AddBlockObservationI18N.cancelText,
    open: false,
    onClose: () => {
      dialogContext.setYesNoDialog({ open: false });
    },
    onNo: () => {
      dialogContext.setYesNoDialog({ open: false });
    },
    onYes: () => {
      dialogContext.setYesNoDialog({ open: false });
      history.push(`/projects/${projectId}/surveys/${surveyId}/observations`);
    }
  };

  const handleCancel = () => {
    dialogContext.setYesNoDialog(defaultCancelDialogProps);
    history.push(`/projects/${projectId}/surveys/${surveyId}/observations`);
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
        ...defaultCancelDialogProps,
        onYes: () => {
          dialogContext.setYesNoDialog({ open: false });
          history.push(location.pathname);
        },
        open: true
      });
      return false;
    }

    // If the cancel dialog is already open and another location change action is triggered: allow it
    return true;
  };

  if (!projectWithDetails || !surveyWithDetails) {
    return <CircularProgress className="pageProgress" size={40} />;
  }

  return (
    <>
      <Prompt when={enableCancelCheck} message={handleLocationChange} />
      <Box my={3}>
        <Container maxWidth="xl">
          <Box mb={3}>
            <Breadcrumbs>
              <Link
                color="primary"
                onClick={() => history.push('/projects')}
                aria-current="page"
                className={classes.breadCrumbLink}>
                <Typography variant="body2">Projects</Typography>
              </Link>
              <Link
                color="primary"
                onClick={() => history.push(`/projects/${projectId}/surveys`)}
                aria-current="page"
                className={classes.breadCrumbLink}>
                <Typography variant="body2">{projectWithDetails.project.project_name}</Typography>
              </Link>
              <Link
                color="primary"
                onClick={() => history.push(`/projects/${projectId}/surveys/${surveyId}/observations`)}
                aria-current="page"
                className={classes.breadCrumbLink}>
                <Typography variant="body2">{surveyWithDetails.survey_details.survey_name}</Typography>
              </Link>
              <Typography variant="body2">{observationId ? 'Edit' : 'Add'} Block Observation</Typography>
            </Breadcrumbs>
          </Box>
          <Box mb={3}>
            <Typography data-testid="block-observation-heading" variant="h1">
              {observationId ? 'Edit' : 'Add'} Block Observation
            </Typography>
          </Box>
          <Box mb={5}>
            <Typography variant="body1">
              Lorem Ipsum dolor sit amet, consecteur, Lorem Ipsum dolor sit amet, consecteur. Lorem Ipsum dolor sit
              amet, consecteur. Lorem Ipsum dolor sit amet, consecteur. Lorem Ipsum dolor sit amet, consecteur
            </Typography>
          </Box>
          <Box pl={3} pr={3} component={Paper} display="block">
            <Formik
              innerRef={formikRef}
              initialValues={observationWithDetails}
              validationSchema={BlockObservationYupSchema}
              enableReinitialize={true}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={() => {}}>
              <BlockObservationForm tableRef={hotRef} tableData={tableData} />
            </Formik>
            <Box mt={2} pb={3} display="flex" justifyContent="flex-end">
              {!observationId && (
                <>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    data-testid="save-and-exit-button"
                    onClick={() => console.log('add and exit functionality')}
                    className={classes.actionButton}>
                    Save and Exit
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={() => console.log('add and next block functionality')}
                    className={classes.actionButton}>
                    Save and Next Block
                  </Button>
                </>
              )}
              {observationId && (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  data-testid="save-changes-button"
                  onClick={() => console.log('edit functionality')}
                  className={classes.actionButton}>
                  Save Changes
                </Button>
              )}
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

export default BlockObservationPage;