import { SUBMISSION_MESSAGE_TYPE, SUBMISSION_STATUS_TYPE } from '../constants/status';
import { IDBConnection } from '../database/db';
import { ErrorRepository } from '../repositories/error-repository';
import { SubmissionError } from '../utils/submission-error';
import { DBService } from './db-service';

export class ErrorService extends DBService {
  errorRepository: ErrorRepository;

  constructor(connection: IDBConnection) {
    super(connection);

    this.errorRepository = new ErrorRepository(connection);
  }

  /**
   * Inserts both the status and message of a submission
   *
   * @param {number} submissionId
   * @param {SUBMISSION_STATUS_TYPE} submissionStatusType
   * @param {SUBMISSION_MESSAGE_TYPE} submissionMessageType
   * @param {string} submissionMessage
   * @return {*}  {Promise<{
   *     submission_status_id: number;
   *     submission_message_id: number;
   *   }>}
   * @memberof SubmissionService
   */
  async insertSubmissionStatusAndMessage(
    submissionId: number,
    submissionStatusType: SUBMISSION_STATUS_TYPE,
    submissionMessageType: SUBMISSION_MESSAGE_TYPE,
    submissionMessage: string
  ): Promise<{
    submission_status_id: number;
    submission_message_id: number;
  }> {
    const submission_status_id = (await this.errorRepository.insertSubmissionStatus(submissionId, submissionStatusType))
      .submission_status_id;

    const submission_message_id = (
      await this.errorRepository.insertSubmissionMessage(submission_status_id, submissionMessageType, submissionMessage)
    ).submission_message_id;

    return {
      submission_status_id,
      submission_message_id
    };
  }

  /**
   * Insert a submission status record.
   *
   * @param {number} submissionId
   * @param {SUBMISSION_STATUS_TYPE} submissionStatusType
   * @return {*}  {Promise<{
   *     submission_status_id: number;
   *     submission_status_type_id: number;
   *   }>}
   * @memberof SubmissionService
   */
  async insertSubmissionStatus(
    submissionId: number,
    submissionStatusType: SUBMISSION_STATUS_TYPE
  ): Promise<{
    submission_status_id: number;
    submission_status_type_id: number;
  }> {
    return this.errorRepository.insertSubmissionStatus(submissionId, submissionStatusType);
  }

  /**
   * Insert a submission m record.
   *
   * @param {number} submissionId
   * @param {SUBMISSION_STATUS_TYPE} submissionStatusType
   * @return {*}  {Promise<{
   *     submission_status_id: number;
   *     submission_status_type_id: number;
   *   }>}
   * @memberof SubmissionService
   */
  async insertSubmissionMessage(
    submissionStatusId: number,
    submissionMessageType: SUBMISSION_MESSAGE_TYPE,
    submissionMessage: string
  ): Promise<{
    submission_message_id: number;
    submission_message_type_id: number;
  }> {
    return this.errorRepository.insertSubmissionMessage(submissionStatusId, submissionMessageType, submissionMessage);
  }

  async insertSubmissionError(submissionId: number, error: SubmissionError) {
    const submission_status_id = (await this.errorRepository.insertSubmissionStatus(submissionId, error.status))
      .submission_status_id;
    const promises = error.submissionMessages.map((message) => {
      return this.errorRepository.insertSubmissionMessage(submission_status_id, message.type, message.description);
    });

    await Promise.all(promises);
  }
}
