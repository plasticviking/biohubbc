import { RequestHandler } from 'express';
import { Operation } from 'express-openapi';
import { PROJECT_PERMISSION, SYSTEM_ROLE } from '../../../../../../../constants/roles';
import { getDBConnection } from '../../../../../../../database/db';
import { HTTP400 } from '../../../../../../../errors/http-error';
import { authorizeRequestHandler } from '../../../../../../../request-handlers/security/authorization';
import { AttachmentService } from '../../../../../../../services/attachment-service';
import { scanFileForVirus, uploadFileToS3 } from '../../../../../../../utils/file-utils';
import { getLogger } from '../../../../../../../utils/logger';

const defaultLog = getLogger('/api/project/{projectId}/survey/{surveyId}/attachments/report/upload');

export const POST: Operation = [
  authorizeRequestHandler((req) => {
    return {
      or: [
        {
          validProjectPermissions: [PROJECT_PERMISSION.COORDINATOR, PROJECT_PERMISSION.COLLABORATOR],
          projectId: Number(req.params.projectId),
          discriminator: 'ProjectPermission'
        },
        {
          validSystemRoles: [SYSTEM_ROLE.DATA_ADMINISTRATOR],
          discriminator: 'SystemRole'
        }
      ]
    };
  }),
  uploadMedia()
];
POST.apiDoc = {
  description: 'Upload a survey-specific report.',
  tags: ['attachment'],
  security: [
    {
      Bearer: []
    }
  ],
  parameters: [
    {
      in: 'path',
      name: 'projectId',
      schema: {
        type: 'integer',
        minimum: 1
      },
      required: true
    },
    {
      in: 'path',
      name: 'surveyId',
      schema: {
        type: 'integer',
        minimum: 1
      },
      required: true
    }
  ],
  requestBody: {
    description: 'Attachment upload post request object.',
    content: {
      'multipart/form-data': {
        schema: {
          type: 'object',
          required: ['media', 'attachmentMeta'],
          properties: {
            media: {
              type: 'string',
              format: 'binary'
            },
            attachmentMeta: {
              type: 'object',
              required: ['title', 'year_published', 'authors', 'description'],
              properties: {
                title: {
                  type: 'string'
                },
                year_published: {
                  type: 'string',
                  description:
                    'Year the report is published. (Note: Content-Type: multipart/form-data requires all parameters to be strings.)'
                },
                authors: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['first_name', 'last_name'],
                    properties: {
                      first_name: {
                        type: 'string'
                      },
                      last_name: {
                        type: 'string'
                      }
                    }
                  }
                },
                description: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Report upload response.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            description: 'The S3 unique key for this file.',
            required: ['attachmentId', 'revision_count'],
            properties: {
              attachmentId: {
                type: 'number'
              },
              revision_count: {
                type: 'number'
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
      $ref: '#/components/responses/403'
    },
    500: {
      $ref: '#/components/responses/500'
    },
    default: {
      $ref: '#/components/responses/default'
    }
  }
};

/**
 * Uploads any media in the request to S3, adding their keys to the request.
 * Also adds the metadata to the survey_attachment DB table
 * Does nothing if no media is present in the request.
 *
 * @returns {RequestHandler}
 */
export function uploadMedia(): RequestHandler {
  return async (req, res) => {
    const rawMediaArray: Express.Multer.File[] = req.files as Express.Multer.File[];

    if (!rawMediaArray || !rawMediaArray.length) {
      // no media objects included, skipping media upload step
      throw new HTTP400('Missing upload data');
    }

    const rawMediaFile: Express.Multer.File = rawMediaArray[0];

    defaultLog.debug({
      label: 'uploadMedia',
      message: 'files',
      files: { ...rawMediaFile, buffer: 'Too big to print' }
    });

    const connection = getDBConnection(req['keycloak_token']);

    try {
      await connection.open();

      // Scan file for viruses using ClamAV
      const virusScanResult = await scanFileForVirus(rawMediaFile);

      if (!virusScanResult) {
        throw new HTTP400('Malicious content detected, upload cancelled');
      }

      const attachmentService = new AttachmentService(connection);

      const upsertResult = await attachmentService.upsertSurveyReportAttachment(
        rawMediaFile,
        Number(req.params.projectId),
        Number(req.params.surveyId),
        req.body.attachmentMeta
      );

      const metadata = {
        filename: rawMediaFile.originalname,
        username: (req['auth_payload'] && req['auth_payload'].preferred_username) || '',
        email: (req['auth_payload'] && req['auth_payload'].email) || ''
      };

      const result = await uploadFileToS3(rawMediaFile, upsertResult.key, metadata);

      defaultLog.debug({ label: 'uploadMedia', message: 'result', result });

      await connection.commit();

      return res
        .status(200)
        .json({ attachmentId: upsertResult.survey_report_attachment_id, revision_count: upsertResult.revision_count });
    } catch (error) {
      defaultLog.error({ label: 'uploadMedia', message: 'error', error });
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  };
}
