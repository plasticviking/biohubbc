import { Feature } from 'geojson';
import { getLogger } from '../utils/logger';

const defaultLog = getLogger('models/survey-update');

/**
 * Pre-processes PUT /project/{projectId}/survey/{surveyId} survey data for update
 *
 * @export
 * @class PutSurveyData
 */
export class PutSurveyData {
  name: string;
  objectives: string;
  species: string;
  start_date: string;
  end_date: string;
  lead_first_name: string;
  lead_last_name: string;
  location_name: string;
  geometry: Feature[];
  revision_count: number;

  constructor(obj?: any) {
    defaultLog.debug({ label: 'PutSurveyData', message: 'params', obj });

    this.name = obj?.survey_name || null;
    this.objectives = obj?.survey_purpose || null;
    this.species = obj?.species || null;
    this.start_date = obj?.start_date || null;
    this.end_date = obj?.end_date || null;
    this.lead_first_name = obj?.biologist_first_name || null;
    this.lead_last_name = obj?.biologist_last_name || null;
    this.location_name = obj?.survey_area_name || null;
    this.geometry = obj?.geometry || null;
    this.revision_count = obj?.revision_count ?? null;
  }
}