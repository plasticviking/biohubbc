import { IDBConnection } from '../database/db';
import {
  AttachmentRepository,
  IProjectAttachment,
  IProjectAttachmentSecurityReason,
  IProjectReportAttachment,
  IProjectReportSecurityReason,
  IReportAttachmentAuthor,
  ISurveyAttachment,
  ISurveyAttachmentSecurityReason,
  ISurveyReportAttachment,
  ISurveyReportSecurityReason,
  WithSecurityRuleCount
} from '../repositories/attachment-repository';
import { DBService } from './db-service';

export interface IAttachmentType {
  id: number;
  type: 'Report' | 'Other';
}

/**
 * A repository class for accessing project and survey attachment data and
 * enumerating attachment security rules.
 *
 * @export
 * @class AttachmentRepository
 * @extends {BaseRepository}
 */
export class AttachmentService extends DBService {
  attachmentRepository: AttachmentRepository;

  constructor(connection: IDBConnection) {
    super(connection);

    this.attachmentRepository = new AttachmentRepository(connection);
  }

  /**
   * Finds all of the project attachments for the given project ID.
   * @param {number} projectId the ID of the project
   * @return {Promise<IProjectAttachment[]>} Promise resolving all project attachments.
   * @memberof AttachmentService
   */
  async getProjectAttachments(projectId: number): Promise<IProjectAttachment[]> {
    return this.attachmentRepository.getProjectAttachments(projectId);
  }

  /**
   * Finds a project attachment having the given project ID and attachment ID
   * @param {number} projectId the ID of the project
   * @param {number} attachmentId the ID of the attachment
   * @return {Promise<IProjectAttachment>} Promise resolving the given project attachment
   * @memberof AttachmentService
   */
  async getProjectAttachmentById(projectId: number, attachmentId: number): Promise<IProjectAttachment> {
    return this.attachmentRepository.getProjectAttachmentById(projectId, attachmentId);
  }

  /**
   * Finds all project attachments for the given project attachment ID, including security rule counts.
   * @param {number} projectId the ID of the project
   * @return {Promise<IProjectAttachment[]>} Promise resolving all project attachments with security
   * counts.
   * @memberof AttachmentService
   */
  async getProjectAttachmentsWithSecurityCounts(
    projectId: number
  ): Promise<WithSecurityRuleCount<IProjectAttachment>[]> {
    return this.attachmentRepository.getProjectAttachmentsWithSecurityCounts(projectId);
  }

  /**
   * Finds all authors belonging to the given project report attachment
   * @param {number} reportAttachmentId the ID of the report attachment
   * @return {Promise<IReportAttachmentAuthor[]>} Promise resolving all of the report authors
   * @memberof AttachmentService
   */
  async getProjectReportAttachmentAuthors(reportAttachmentId: number): Promise<IReportAttachmentAuthor[]> {
    return this.attachmentRepository.getProjectReportAttachmentAuthors(reportAttachmentId);
  }

  /**
   * Finds all security reasons belonging to the given project attachment
   * @param {number} attachmentId the ID of the project attachment
   * @return {Promise<IProjectAttachmentSecurityReason[]>} Promise resolving all project attachment security
   * reasons for the given attachment
   * @memberof AttachmentService
   */
  async getProjectAttachmentSecurityReasons(attachmentId: number): Promise<IProjectAttachmentSecurityReason[]> {
    return this.attachmentRepository.getProjectAttachmentSecurityReasons(attachmentId);
  }

  /**
   * Attaches the given list of security rules to the specified project attachment
   * @param {number[]} securityIds the array of security rule IDs to attach
   * @param {number} attachmentId the ID of the project attachment
   * @return {Promise<void>}
   * @memberof AttachmentService
   */
  async addSecurityRulesToProjectAttachment(securityIds: number[], attachmentId: number): Promise<void> {
    return this.attachmentRepository.addSecurityRulesToProjectAttachment(securityIds, attachmentId);
  }

  /**
   * Attaches the given list of security rules to the specified list of attachments
   * @param {number[]} securityIds the array of security rule IDs to attach
   * @param {number[]} attachmentIds the array of project attachment IDs
   * @return {Promise<void>}
   * @memberof AttachmentService
   */
  async addSecurityRulesToProjectAttachments(securityIds: number[], attachmentIds: number[]): Promise<void> {
    await Promise.all(
      attachmentIds.map((attachmentId) => this.addSecurityRulesToProjectAttachment(securityIds, attachmentId))
    );
  }

  /**
   * Detaches the specified list of security rules from a given project attachment
   * @param {number[]} securityIds the array of security IDs to detach
   * @param {number} attachmentId the ID of the project attachment
   * @return {Promise<void>}
   * @memberof AttachmentService
   */
  async removeSecurityRulesFromProjectAttachment(securityIds: number[], attachmentId: number): Promise<void> {
    await Promise.all(
      securityIds.map((securityId) =>
        this.attachmentRepository.removeSecurityRuleFromProjectAttachment(securityId, attachmentId)
      )
    );
  }

  /**
   * Detaches all security rules from a given project attachment
   * @param {number} attachmentId the ID of the project attachment
   * @return {Promise<void>}
   * @memberof AttachmentService
   */
  async removeAllSecurityFromProjectAttachment(attachmentId: number): Promise<void> {
    return this.attachmentRepository.removeAllSecurityFromProjectAttachment(attachmentId);
  }

  /**
   * Finds all of the project report attachments for the given project ID.
   * @param {number} projectId the ID of the project
   * @return {Promise<IProjectReportAttachment[]>} Promise resolving all project report attachments.
   * @memberof AttachmentService
   */
  async getProjectReportAttachments(projectId: number): Promise<IProjectReportAttachment[]> {
    return this.attachmentRepository.getProjectReportAttachments(projectId);
  }

  /**
   * Finds all project report attachments for the given project ID, including security rule counts.
   * @param {number} projectId
   * @return {Promise<WithSecurityRuleCount<IProjectReportAttachment>[]>} Promise resolving all project report attachments with
   * security counts.
   * @memberof AttachmentService
   */
  async getProjectReportAttachmentsWithSecurityCounts(
    projectId: number
  ): Promise<WithSecurityRuleCount<IProjectReportAttachment>[]> {
    return this.attachmentRepository.getProjectReportAttachmentsWithSecurityCounts(projectId);
  }

  /**
   * Finds a project report attachment having the given project ID and report attachment ID
   * @param {number} projectId the ID of the project
   * @param {number} reportAttachmentId the ID of the report attachment
   * @return {Promise<IProjectReportAttachment>} Promise resolving the given project report attachment
   * @memberof AttachmentService
   */
  async getProjectReportAttachmentById(
    projectId: number,
    reportAttachmentId: number
  ): Promise<IProjectReportAttachment> {
    return this.attachmentRepository.getProjectReportAttachmentById(projectId, reportAttachmentId);
  }

  /**
   * Finds all security reasons belonging to the given project report attachment
   * @param {number} reportAttachmentId the ID of the project report attachment
   * @return {Promise<IProjectReportAttachmentSecurityReason[]>} Promise resolving all project report attachment security
   * reasons for the given report attachment
   * @memberof AttachmentService
   */
  async getProjectReportAttachmentSecurityReasons(reportAttachmentId: number): Promise<IProjectReportSecurityReason[]> {
    return this.attachmentRepository.getProjectReportAttachmentSecurityReasons(reportAttachmentId);
  }

  /**
   * Attaches the given list of security rules to the specified list of report attachments
   * @param {number[]} securityIds the array of security rule IDs to attach
   * @param {number[]} attachmentIds the array of project attachment IDs
   * @return {Promise<void>}
   * @memberof AttachmentService
   */
  async addSecurityRulesToProjectReportAttachments(securityIds: number[], attachmentIds: number[]): Promise<void> {
    await Promise.all(
      attachmentIds.map((attachmentId) => this.addSecurityRulesToProjectReportAttachment(securityIds, attachmentId))
    );
  }

  /**
   * Detaches the specified list of security rules from a given project report attachment
   * @param {number[]} securityIds the array of security IDs to detach
   * @param {number} reportAttachmentId the ID of the project report attachment
   * @return {Promise<void>}
   * @memberof AttachmentService
   */
  async removeSecurityRulesFromProjectReportAttachment(
    securityIds: number[],
    reportAttachmentId: number
  ): Promise<void> {
    await Promise.all(
      securityIds.map((securityId) =>
        this.attachmentRepository.removeSecurityRuleFromProjectReportAttachment(securityId, reportAttachmentId)
      )
    );
  }

  /**
   * Detaches all security rules from a given project report attachment
   * @param {number} reportAttachmentId the ID of the project report attachment
   * @return {Promise<void>}
   * @memberof AttachmentService
   */
  async removeAllSecurityFromProjectReportAttachment(reportAttachmentId: number): Promise<void> {
    return this.attachmentRepository.removeAllSecurityFromProjectReportAttachment(reportAttachmentId);
  }

  /**
   * Finds all of the survey attachments for the given survey ID.
   * @param {number} surveyId the ID of the survey
   * @return {Promise<ISurveyAttachment[]>} Promise resolving all survey attachments.
   * @memberof AttachmentService
   */
  async getSurveyAttachments(surveyId: number): Promise<ISurveyAttachment[]> {
    return this.attachmentRepository.getSurveyAttachments(surveyId);
  }

  /**
   * Finds all survey attachments for the given survey attachment ID, including security rule counts.
   * @param {number} surveyId the ID of the survey
   * @return {Promise<ISurveyAttachment[]>} Promise resolving all survey attachments with security
   * counts.
   * @memberof AttachmentService
   */
  async getSurveyAttachmentsWithSecurityCounts(surveyId: number): Promise<WithSecurityRuleCount<ISurveyAttachment>[]> {
    return this.attachmentRepository.getSurveyAttachmentsWithSecurityCounts(surveyId);
  }

  /**
   * Attaches the given list of security rules to the specified survey attachment
   * @param {number[]} securityIds the array of security rule IDs to attach
   * @param {number} attachmentId the ID of the survey attachment
   * @return {Promise<void>}
   * @memberof AttachmentService
   */
  async addSecurityRulesToSurveyAttachment(securityIds: number[], attachmentId: number): Promise<void> {
    return this.attachmentRepository.addSecurityRulesToSurveyAttachment(securityIds, attachmentId);
  }

  /**
   * Detaches the specified list of security rules from a given survey attachment
   * @param {number[]} securityIds the array of security IDs to detach
   * @param {number} attachmentId the ID of the survey attachment
   * @return {Promise<void>}
   * @memberof AttachmentService
   */
  async removeSecurityRulesFromSurveyAttachment(securityIds: number[], attachmentId: number): Promise<void> {
    await Promise.all(
      securityIds.map((securityId) =>
        this.attachmentRepository.removeSecurityRuleFromSurveyAttachment(securityId, attachmentId)
      )
    );
  }

  /**
   * Detaches all security rules from a given survey attachment
   * @param {number} attachmentId the ID of the survey attachment
   * @return {Promise<void>}
   * @memberof AttachmentService
   */
  async removeAllSecurityFromSurveyAttachment(attachmentId: number): Promise<void> {
    return this.attachmentRepository.removeAllSecurityFromSurveyAttachment(attachmentId);
  }

  /**
   * Finds all of the survey report attachments for the given survey ID.
   * @param {number} surveyId the ID of the survey
   * @return {Promise<ISurveyReportAttachment[]>} Promise resolving all survey report attachments.
   * @memberof AttachmentService
   */
  async getSurveyReportAttachments(surveyId: number): Promise<ISurveyReportAttachment[]> {
    return this.attachmentRepository.getSurveyReportAttachments(surveyId);
  }

  /**
   * Finds all survey report attachments for the given survey ID, including security rule counts.
   * @param {number} surveyId
   * @return {Promise<WithSecurityRuleCount<ISurveyReportAttachment>[]>} Promise resolving all survey report attachments with
   * security counts.
   * @memberof AttachmentService
   */
  async getSurveyReportAttachmentsWithSecurityCounts(
    surveyId: number
  ): Promise<WithSecurityRuleCount<ISurveyReportAttachment>[]> {
    return this.attachmentRepository.getSurveyReportAttachmentsWithSecurityCounts(surveyId);
  }

  /**
   * Attaches the given list of security rules to the specified project report attachment
   * @param {number[]} securityIds the array of security rule IDs to attach
   * @param {number} reportAttachmentId the ID of the report attachment
   * @return {Promise<void>}
   * @memberof AttachmentService
   */
  async addSecurityRulesToProjectReportAttachment(securityIds: number[], reportAttachmentId: number): Promise<void> {
    return this.attachmentRepository.addSecurityRulesToProjectReportAttachment(securityIds, reportAttachmentId);
  }

  /**
   * Attaches the given list of security rules to the specified survey report attachment
   * @param {number[]} securityIds the array of security rule IDs to attach
   * @param {number} reportAttachmentId the ID of the survey report attachment
   * @return {Promise<void>}
   * @memberof AttachmentService
   */
  async addSecurityRulesToSurveyReportAttachment(securityIds: number[], reportAttachmentId: number): Promise<void> {
    return this.attachmentRepository.addSecurityRulesToSurveyReportAttachment(securityIds, reportAttachmentId);
  }

  /**
   * Detaches all security rules from a given survey report attachment
   * @param {number} reportAttachmentId the ID of the survey report attachment
   * @return {Promise<void>}
   * @memberof AttachmentService
   */
  async removeAllSecurityFromSurveyReportAttachment(reportAttachmentId: number): Promise<void> {
    await this.attachmentRepository.removeAllSecurityFromSurveyReportAttachment(reportAttachmentId);
  }

  /**
   * Detaches the specified list of security rules from a given survey report attachment
   * @param {number[]} securityIds the array of security IDs to detach
   * @param {number} reportAttachmentId the ID of the survey report attachment
   * @return {Promise<void>}
   * @memberof AttachmentService
   */
  async removeSecurityRulesFromSurveyReportAttachment(
    securityIds: number[],
    reportAttachmentId: number
  ): Promise<void> {
    await Promise.all(
      securityIds.map((securityId) =>
        this.attachmentRepository.removeSecurityRuleFromSurveyReportAttachment(securityId, reportAttachmentId)
      )
    );
  }

  /**
   * Attaches the given list of security rules to each attachment from a list of attachments and report
   * attachments
   * @param {number[]} securityIds The array of security IDs
   * @param {IAttachmentType[]} attachments The array of attachments
   * @return {Promise<void>}
   * @memberof AttachmentService
   */
  async addSecurityRulesToProjectAttachmentsOrProjectReports(
    securityIds: number[],
    attachments: IAttachmentType[]
  ): Promise<void> {
    await Promise.all(
      attachments.map((attachment: IAttachmentType) => {
        if (attachment.type === 'Report') {
          return Promise.all([
            this.addSecurityRulesToProjectReportAttachment(securityIds, attachment.id),
            this.addSecurityReviewTimeToProjectReportAttachment(attachment.id)
          ]);
        } else {
          return Promise.all([
            this.addSecurityRulesToProjectAttachment(securityIds, attachment.id),
            this.addSecurityReviewTimeToProjectAttachment(attachment.id)
          ]);
        }
      })
    );
  }

  /**
   * Attaches the given list of security rules to each attachment from a list of survey attachments and
   * survey report attachments
   * @param {number[]} securityIds The array of security IDs
   * @param {IAttachmentType[]} attachments The array of attachments
   * @return {Promise<void>}
   * @memberof AttachmentService
   */
  async addSecurityRulesToSurveyAttachmentsOrSurveyReports(
    securityIds: number[],
    attachments: IAttachmentType[]
  ): Promise<void> {
    await Promise.all(
      attachments.map((attachment: IAttachmentType) => {
        if (attachment.type === 'Report') {
          return Promise.all([
            this.addSecurityRulesToSurveyReportAttachment(securityIds, attachment.id),
            this.addSecurityReviewTimeToSurveyReportAttachment(attachment.id)
          ]);
        } else {
          return Promise.all([
            this.addSecurityRulesToSurveyAttachment(securityIds, attachment.id),
            this.addSecurityReviewTimeToSurveyAttachment(attachment.id)
          ]);
        }
      })
    );
  }

  /**
   * Updates the security review timestamp belonging to the given project report attachment
   * @param {number} reportAttachmentId the ID of the project report attachment
   * @return {Promise<void>}
   * @memberof AttachmentService
   */
  async addSecurityReviewTimeToProjectReportAttachment(reportAttachmentId: number): Promise<void> {
    return this.attachmentRepository.addSecurityReviewTimeToProjectReportAttachment(reportAttachmentId);
  }

  /**
   * Updates the security review timestamp belonging to the given project attachment
   * @param {number} attachmentId the ID of the project attachment
   * @return {Promise<void>}
   * @memberof AttachmentService
   */
  async addSecurityReviewTimeToProjectAttachment(attachmentId: number): Promise<void> {
    return this.attachmentRepository.addSecurityReviewTimeToProjectAttachment(attachmentId);
  }

  /**
   * Updates the security review timestamp belonging to the given survey report attachment
   * @param {number} reportAttachmentId the ID of the survey report attachment
   * @return {Promise<void>}
   * @memberof AttachmentService
   */
  async addSecurityReviewTimeToSurveyReportAttachment(reportAttachmentId: number): Promise<void> {
    return this.attachmentRepository.addSecurityReviewTimeToSurveyReportAttachment(reportAttachmentId);
  }

  /**
   * Updates the security review timestamp belonging to the given survey attachment
   * @param {number} attachmentId the ID of the survey
   * @return {Promise<void>}
   * @memberof AttachmentService
   */
  async addSecurityReviewTimeToSurveyAttachment(attachmentId: number): Promise<void> {
    return this.attachmentRepository.addSecurityReviewTimeToSurveyAttachment(attachmentId);
  }

  /**
   * Finds a survey report attachment having the given survey ID and attachment ID
   * @param {number} surveyId the ID of the survey
   * @param {number} reportAttachmentId the ID of the survey report attachment
   * @return {Promise<ISurveyAttachment>} Promise resolving the given survey attachment
   * @memberof AttachmentService
   */
  async getSurveyReportAttachmentById(surveyId: number, reportAttachmentId: number): Promise<ISurveyReportAttachment> {
    return this.attachmentRepository.getSurveyReportAttachmentById(surveyId, reportAttachmentId);
  }

  /**
   * Finds all authors belonging to the given survey attachment
   * @param {number} reportAttachmentId the ID of the report attachment
   * @return {Promise<IReportAttachmentAuthor[]>} Promise resolving all of the report authors
   * @memberof AttachmentService
   */
  async getSurveyAttachmentAuthors(reportAttachmentId: number): Promise<IReportAttachmentAuthor[]> {
    return this.attachmentRepository.getSurveyReportAttachmentAuthors(reportAttachmentId);
  }

  /**
   * Finds all security reasons belonging to the given survey report attachment
   * @param {number} reportAttachmentId the ID of the survey report attachment
   * @return {Promise<ISurveyReportAttachmentSecurityReason[]>} Promise resolving all survey report attachment security
   * reasons for the given report attachment
   * @memberof AttachmentService
   */
  async getSurveyReportAttachmentSecurityReasons(reportAttachmentId: number): Promise<ISurveyReportSecurityReason[]> {
    return this.attachmentRepository.getSurveyReportAttachmentSecurityReasons(reportAttachmentId);
  }

  /**
   * Finds all security reasons belonging to the given survey attachment
   * @param {number} attachmentId the ID of the survey attachment
   * @return {Promise<ISurveyAttachmentSecurityReason[]>} Promise resolving all survey attachment security
   * reasons for the given attachment
   * @memberof AttachmentService
   */
  async getSurveyAttachmentSecurityReasons(attachmentId: number): Promise<ISurveyAttachmentSecurityReason[]> {
    return this.attachmentRepository.getSurveyAttachmentSecurityReasons(attachmentId);
  }
}