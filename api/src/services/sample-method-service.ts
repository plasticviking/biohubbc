import { IDBConnection } from '../database/db';
import {
  InsertSampleMethodRecord,
  SampleMethodRecord,
  SampleMethodRepository,
  UpdateSampleMethodRecord
} from '../repositories/sample-method-repository';
import { DBService } from './db-service';
import { SamplePeriodService } from './sample-period-service';

/**
 * Sample Method Repository
 *
 * @export
 * @class SampleMethodService
 * @extends {DBService}
 */
export class SampleMethodService extends DBService {
  sampleMethodRepository: SampleMethodRepository;

  constructor(connection: IDBConnection) {
    super(connection);
    this.sampleMethodRepository = new SampleMethodRepository(connection);
  }

  /**
   * Gets all survey Sample Methods.
   *
   * @param {number} surveySampleSiteId
   * @return {*}  {Promise<SampleMethodRecord[]>}
   * @memberof SampleMethodService
   */
  async getSampleMethodsForSurveySampleSiteId(surveySampleSiteId: number): Promise<SampleMethodRecord[]> {
    return await this.sampleMethodRepository.getSampleMethodsForSurveySampleSiteId(surveySampleSiteId);
  }

  /**
   * Deletes a survey Sample Method.
   *
   * @param {number} surveySampleMethodId
   * @return {*}  {Promise<SampleMethodRecord>}
   * @memberof SampleMethodService
   */
  async deleteSampleMethodRecord(surveySampleMethodId: number): Promise<SampleMethodRecord> {
    return this.sampleMethodRepository.deleteSampleMethodRecord(surveySampleMethodId);
  }

  /**
   * Inserts survey Sample Method and associated Sample Periods.
   *
   * @param {InsertSampleMethodRecord} sampleMethod
   * @return {*}  {Promise<SampleMethodRecord>}
   * @memberof SampleMethodService
   */
  async insertSampleMethod(sampleMethod: InsertSampleMethodRecord): Promise<SampleMethodRecord> {
    // Create new sample method
    const record = await this.sampleMethodRepository.insertSampleMethod(sampleMethod);

    const samplePeriodService = new SamplePeriodService(this.connection);
    // Loop through and create periods, associating the newly created sample method id to each
    const promises = sampleMethod.periods.map((item) => {
      const samplePeriod = {
        survey_sample_method_id: record.survey_sample_method_id,
        start_date: item.start_date,
        end_date: item.end_date
      };
      return samplePeriodService.insertSamplePeriod(samplePeriod);
    });

    await Promise.all(promises);
    return record;
  }

  /**
   * updates a survey Sample method.
   *
   * @param {InsertSampleMethodRecord} sampleMethod
   * @return {*}  {Promise<SampleMethodRecord>}
   * @memberof SampleMethodService
   */
  async updateSampleMethod(sampleMethod: UpdateSampleMethodRecord): Promise<SampleMethodRecord> {
    return this.sampleMethodRepository.updateSampleMethod(sampleMethod);
  }
}