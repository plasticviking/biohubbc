import { Feature } from '@turf/helpers';
import { IDBConnection } from '../database/db';
import {
  SampleLocationRecord,
  SampleLocationRepository,
  UpdateSampleSiteRecord
} from '../repositories/sample-location-repository';
import { InsertSampleMethodRecord } from '../repositories/sample-method-repository';
import { DBService } from './db-service';
import { SampleMethodService } from './sample-method-service';

interface SampleSite {
  name: string;
  description: string;
  feature: Feature;
}

export interface PostSampleLocations {
  survey_sample_site_id: number | null;
  survey_id: number;
  survey_sample_sites: SampleSite[];
  methods: InsertSampleMethodRecord[];
}

/**
 * Sample Location Repository
 *
 * @export
 * @class SampleLocationService
 * @extends {DBService}
 */
export class SampleLocationService extends DBService {
  sampleLocationRepository: SampleLocationRepository;

  constructor(connection: IDBConnection) {
    super(connection);
    this.sampleLocationRepository = new SampleLocationRepository(connection);
  }

  /**
   * Gets all survey Sample Locations.
   *
   * @param {number} surveyId
   * @return {*}  {Promise<SampleLocationRecord[]>}
   * @memberof SampleLocationService
   */
  async getSampleLocationsForSurveyId(surveyId: number): Promise<SampleLocationRecord[]> {
    return await this.sampleLocationRepository.getSampleLocationsForSurveyId(surveyId);
  }

  /**
   * Deletes a survey Sample Location.
   *
   * @param {number} surveySampleSiteId
   * @return {*}  {Promise<SampleLocationRecord>}
   * @memberof SampleLocationService
   */
  async deleteSampleLocationRecord(surveySampleSiteId: number): Promise<SampleLocationRecord> {
    const sampleMethodService = new SampleMethodService(this.connection);

    // Delete all methods associated with the sample location
    const existingSampleMethods = await sampleMethodService.getSampleMethodsForSurveySampleSiteId(surveySampleSiteId);
    for (const item of existingSampleMethods) {
      await sampleMethodService.deleteSampleMethodRecord(item.survey_sample_method_id);
    }

    return this.sampleLocationRepository.deleteSampleLocationRecord(surveySampleSiteId);
  }

  /**
   * Inserts survey Sample Locations.
   *
   * It is a business requirement to use strings from the properties field of provided geometry
   * to determine the name and description of sampling locations when possible.
   *
   * If there is no string contained in the fields 'name', 'label' to be used in our db,
   * the system will auto-generate a name of 'Sampling Site #x', where x is taken from the greatest value
   * integer id + 1 in the db.
   *
   * @param {PostSampleLocations} sampleLocations
   * @return {*}  {Promise<SampleLocationRecord[]>}
   * @memberof SampleLocationService
   */
  async insertSampleLocations(sampleLocations: PostSampleLocations): Promise<SampleLocationRecord[]> {
    const methodService = new SampleMethodService(this.connection);
    // Create a sample location for each feature found
    const promises = sampleLocations.survey_sample_sites.map((item) => {
      const sampleLocation = {
        survey_id: sampleLocations.survey_id,
        name: item.name,
        description: item.description,
        geojson: item.feature
      };

      return this.sampleLocationRepository.insertSampleLocation(sampleLocation);
    });
    const results = await Promise.all<SampleLocationRecord>(promises);

    // Loop through all newly reaction sample locations
    // For reach sample location, create methods and associated with sample location id
    const methodPromises = results.map((sampleSite: SampleLocationRecord) =>
      sampleLocations.methods.map((item) => {
        const sampleMethod = {
          survey_sample_site_id: sampleSite.survey_sample_site_id,
          method_lookup_id: item.method_lookup_id,
          description: item.description,
          periods: item.periods
        };
        return methodService.insertSampleMethod(sampleMethod);
      })
    );
    await Promise.all(methodPromises);

    return results;
  }

  /**
   * Updates a survey entire Sample Site Record, with Location and associated methods and periods.
   *
   * @param {UpdateSampleSiteRecord} sampleSite
   * @memberof SampleLocationService
   */
  async updateSampleLocationMethodPeriod(sampleSite: UpdateSampleSiteRecord) {
    const methodService = new SampleMethodService(this.connection);

    // Update the main sample location
    await this.sampleLocationRepository.updateSampleLocation(sampleSite);

    // Check for methods to delete
    await methodService.deleteSampleMethodsNotInArray(sampleSite.survey_sample_site_id, sampleSite.methods);

    // Loop through all methods
    // For each method, check if it exists
    // If it exists, update it
    // If it does not exist, create it
    for (const item of sampleSite.methods) {
      if (item.survey_sample_method_id) {
        const sampleMethod = {
          survey_sample_site_id: sampleSite.survey_sample_site_id,
          survey_sample_method_id: item.survey_sample_method_id,
          method_lookup_id: item.method_lookup_id,
          description: item.description,
          periods: item.periods
        };
        await methodService.updateSampleMethod(sampleMethod);
      } else {
        const sampleMethod = {
          survey_sample_site_id: sampleSite.survey_sample_site_id,
          method_lookup_id: item.method_lookup_id,
          description: item.description,
          periods: item.periods
        };
        await methodService.insertSampleMethod(sampleMethod);
      }
    }
  }
}
