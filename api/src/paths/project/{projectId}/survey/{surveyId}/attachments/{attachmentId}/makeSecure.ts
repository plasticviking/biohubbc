'use strict';

import { RequestHandler } from 'express';
import { Operation } from 'express-openapi';
import { SYSTEM_ROLE } from '../../../../../../../constants/roles';
import { getDBConnection } from '../../../../../../../database/db';
import { HTTP400 } from '../../../../../../../errors/CustomError';
import { getLogger } from '../../../../../../../utils/logger';
import { secureAttachmentRecordSQL } from '../../../../../../../queries/security/security-queries';

const defaultLog = getLogger('/api/project/{projectId}/survey/{surveyId}/attachments/{attachmentId}/makeSecure');

export const PUT: Operation = [makeSurveyAttachmentSecure()];

PUT.apiDoc = {
  description: 'Make security status of a survey attachment secure.',
  tags: ['attachment', 'security_status'],
  security: [
    {
      Bearer: [SYSTEM_ROLE.SYSTEM_ADMIN, SYSTEM_ROLE.PROJECT_ADMIN]
    }
  ],
  parameters: [
    {
      in: 'path',
      name: 'projectId',
      schema: {
        type: 'number'
      },
      required: true
    },
    {
      in: 'path',
      name: 'surveyId',
      schema: {
        type: 'number'
      },
      required: true
    },
    {
      in: 'path',
      name: 'attachmentId',
      schema: {
        type: 'number'
      },
      required: true
    }
  ],
  requestBody: {
    description: 'Current attachment type for survey attachment.',
    content: {
      'application/json': {
        schema: {
          type: 'object'
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Survey attachment make secure security status response.',
      content: {
        'application/json': {
          schema: {
            title: 'Row count of record for which security status has been made secure',
            type: 'number'
          }
        }
      }
    },
    401: {
      $ref: '#/components/responses/401'
    },
    default: {
      $ref: '#/components/responses/default'
    }
  }
};

export function makeSurveyAttachmentSecure(): RequestHandler {
  return async (req, res) => {
    defaultLog.debug({
      label: 'Make security status of a survey attachment secure',
      message: 'params',
      req_params: req.params
    });

    if (!req.params.projectId) {
      throw new HTTP400('Missing required path param `projectId`');
    }

    if (!req.params.surveyId) {
      throw new HTTP400('Missing required path param `surveyId`');
    }

    if (!req.params.attachmentId) {
      throw new HTTP400('Missing required path param `attachmentId`');
    }

    if (!req.body || !req.body.attachmentType) {
      throw new HTTP400('Missing required body param `attachmentType`');
    }

    const connection = getDBConnection(req['keycloak_token']);

    try {
      await connection.open();

      const secureRecordSQLStatement =
        req.body.attachmentType === 'Report'
          ? secureAttachmentRecordSQL(
              Number(req.params.attachmentId),
              'survey_report_attachment',
              Number(req.params.projectId)
            )
          : secureAttachmentRecordSQL(
              Number(req.params.attachmentId),
              'survey_attachment',
              Number(req.params.projectId)
            );

      if (!secureRecordSQLStatement) {
        throw new HTTP400('Failed to build SQL secure record statement');
      }

      const secureRecordSQLResponse = await connection.query(
        secureRecordSQLStatement.text,
        secureRecordSQLStatement.values
      );

      if (!secureRecordSQLResponse || !secureRecordSQLResponse.rowCount) {
        throw new HTTP400('Failed to secure record');
      }

      await connection.commit();

      return res.status(200).json(1);
    } catch (error) {
      defaultLog.debug({ label: 'makeSurveyAttachmentSecure', message: 'error', error });
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  };
}