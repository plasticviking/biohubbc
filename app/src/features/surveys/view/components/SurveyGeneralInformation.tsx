import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { mdiPencilOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { DATE_FORMAT } from 'constants/dateFormats';
import { IGetProjectSurveyForViewResponse } from 'interfaces/useProjectApi.interface';
import React from 'react';
import { getFormattedDateRangeString } from 'utils/Utils';

export interface ISurveyGeneralInformationProps {
  surveyForViewData: IGetProjectSurveyForViewResponse;
}

/**
 * General information content for a survey.
 *
 * @return {*}
 */
const SurveyGeneralInformation: React.FC<ISurveyGeneralInformationProps> = (props) => {
  const { survey } = props.surveyForViewData;

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} height="2rem">
        <Typography variant="h3">General Information</Typography>
        <Button
          variant="text"
          color="primary"
          className="sectionHeaderButton"
          onClick={() => {}}
          title="Edit General Information"
          aria-label="Edit General Information"
          startIcon={<Icon path={mdiPencilOutline} size={0.875} />}>
          Edit
        </Button>
      </Box>
      <dl>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography component="dt" variant="subtitle2" color="textSecondary">
              Survey Name
            </Typography>
            <Typography component="dd" variant="body1">
              {survey.survey_name}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography component="dt" variant="subtitle2" color="textSecondary">
              Survey Timeline
            </Typography>
            <Typography component="dd" variant="body1">
              {survey.end_date ? (
                <>
                  {getFormattedDateRangeString(DATE_FORMAT.ShortMediumDateFormat2, survey.start_date, survey.end_date)}
                </>
              ) : (
                <>
                  <span>Start Date:</span>{' '}
                  {getFormattedDateRangeString(DATE_FORMAT.ShortMediumDateFormat2, survey.start_date)}
                </>
              )}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography component="dt" variant="subtitle2" color="textSecondary">
              Survey Lead
            </Typography>
            <Typography component="dd" variant="body1">
              {survey.biologist_first_name} {survey.biologist_last_name}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography component="dt" variant="subtitle2" color="textSecondary">
              Species
            </Typography>
            <Typography component="dd" variant="body1">
              {survey.species}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item>
            <Box mt={1}>
              <Box display="flex" alignItems="center" justifyContent="space-between" height="2rem">
                <Typography component="dt" variant="subtitle2" color="textSecondary">
                  Purpose
                </Typography>
              </Box>
              <Typography>{survey.survey_purpose}</Typography>
            </Box>
          </Grid>
        </Grid>
      </dl>
    </Box>
  );
};

export default SurveyGeneralInformation;