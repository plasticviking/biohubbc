import { IDBConnection } from '../database/db';
import { PostLocationData } from '../models/survey-create';
import { PutSurveyLocationData } from '../models/survey-update';
import { SurveyLocationRecord, SurveyLocationRepository } from '../repositories/survey-location-repository';
import { DBService } from './db-service';

/**
 * Service for reading/writing survey location data.
 *
 * @export
 * @class SurveyLocationService
 * @extends {DBService}
 */
export class SurveyLocationService extends DBService {
  surveyLocationRepository: SurveyLocationRepository;

  /**
   * Creates an instance of SurveyLocationService.
   *
   * @param {IDBConnection} connection
   * @memberof SurveyLocationService
   */
  constructor(connection: IDBConnection) {
    super(connection);

    this.surveyLocationRepository = new SurveyLocationRepository(connection);
  }

  /**
   * Insert a new survey location record.
   *
   * @param {number} surveyId
   * @param {PostLocationData} data
   * @return {*}  {Promise<void>}
   * @memberof SurveyLocationService
   */
  async insertSurveyLocation(surveyId: number, data: PostLocationData): Promise<void> {
    return this.surveyLocationRepository.insertSurveyLocation(surveyId, data);
  }

  /**
   * Update an existing survey location record.
   *
   * @param {PutSurveyLocationData} data
   * @return {*}  {Promise<void>}
   * @memberof SurveyLocationService
   */
  async updateSurveyLocation(data: PutSurveyLocationData): Promise<void> {
    return this.surveyLocationRepository.updateSurveyLocation(data);
  }
  /**
   * Get survey location records for a given survey ID
   *
   * @param {number} surveyID
   * @returns {*} {Promise<SurveyLocationRecord[]>}
   * @memberof SurveyLocationService
   */
  async getSurveyLocationsData(surveyId: number): Promise<SurveyLocationRecord[]> {
    return this.surveyLocationRepository.getSurveyLocationsData(surveyId);
  }
}