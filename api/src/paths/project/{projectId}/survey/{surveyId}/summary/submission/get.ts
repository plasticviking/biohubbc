'use strict';

import { RequestHandler } from 'express';
import { Operation } from 'express-openapi';
import { SYSTEM_ROLE } from '../../../../../../../constants/roles';
import { getDBConnection } from '../../../../../../../database/db';
import { HTTP400 } from '../../../../../../../errors/CustomError';
import { getLatestSurveySummarySubmissionSQL } from '../../../../../../../queries/survey/survey-summary-queries';
import { getLogger } from '../../../../../../../utils/logger';

const defaultLog = getLogger('/api/project/{projectId}/survey/{surveyId}/summary/submission/get');

export const GET: Operation = [getSurveySummarySubmission()];

GET.apiDoc = {
  description: 'Fetches an summary occurrence submission for a survey.',
  tags: ['summary_submission'],
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
    }
  ],
  responses: {
    200: {
      description: 'Summary submission get response.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: {
                type: 'number'
              },
              fileName: {
                description: 'The file name of the submission',
                type: 'string'
              }
            }
          }
        }
      }
    },
    400: {
      $ref: '#/components/responses/400'
    },
    401: {
      $ref: '#/components/responses/401'
    },
    403: {
      $ref: '#/components/responses/401'
    },
    500: {
      $ref: '#/components/responses/500'
    },
    default: {
      $ref: '#/components/responses/default'
    }
  }
};

export function getSurveySummarySubmission(): RequestHandler {
  return async (req, res) => {
    defaultLog.debug({ label: 'Get a survey summary result', message: 'params', req_params: req.params });

    if (!req.params.surveyId) {
      throw new HTTP400('Missing required path param `surveyId`');
    }

    const connection = getDBConnection(req['keycloak_token']);

    try {
      const getSurveySummarySubmissionSQLStatement = getLatestSurveySummarySubmissionSQL(Number(req.params.surveyId));

      if (!getSurveySummarySubmissionSQLStatement) {
        throw new HTTP400('Failed to build getLatestSurveySummarySubmissionSQLStatement statement');
      }

      await connection.open();

      const summarySubmissionData = await connection.query(
        getSurveySummarySubmissionSQLStatement.text,
        getSurveySummarySubmissionSQLStatement.values
      );

      if (!summarySubmissionData || !summarySubmissionData.rows || !summarySubmissionData.rows[0]) {
        return res.status(200).json(null);
      }

      await connection.commit();

      const getSummarySubmissionData =
        {
          id: summarySubmissionData.rows[0].id,
          fileName: summarySubmissionData.rows[0].file_name
        } || null;

      return res.status(200).json(getSummarySubmissionData);
    } catch (error) {
      defaultLog.debug({ label: 'getSummarySubmissionData', message: 'error', error });
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  };
}