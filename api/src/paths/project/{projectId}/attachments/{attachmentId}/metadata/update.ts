import { RequestHandler } from 'express';
import { Operation } from 'express-openapi';
import { ATTACHMENT_TYPE } from '../../../../../../constants/attachments';
import { PROJECT_PERMISSION, SYSTEM_ROLE } from '../../../../../../constants/roles';
import { getDBConnection } from '../../../../../../database/db';
import {
  IReportAttachmentAuthor,
  PutReportAttachmentMetadata
} from '../../../../../../models/project-survey-attachments';
import { authorizeRequestHandler } from '../../../../../../request-handlers/security/authorization';
import { AttachmentService } from '../../../../../../services/attachment-service';
import { getLogger } from '../../../../../../utils/logger';

const defaultLog = getLogger('/api/project/{projectId}/attachments/{attachmentId}/metadata/update');

export const PUT: Operation = [
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
  updateProjectAttachmentMetadata()
];

PUT.apiDoc = {
  description: 'Update project attachment metadata.',
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
      name: 'attachmentId',
      schema: {
        type: 'integer',
        minimum: 1
      },
      required: true
    }
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          description: 'Attachment metadata for attachments of type: Report.',
          required: ['attachment_type', 'attachment_meta', 'revision_count'],
          properties: {
            attachment_type: {
              type: 'string',
              enum: ['Report']
            },
            attachment_meta: {
              type: 'object',
              required: ['title', 'year_published', 'authors', 'description'],
              properties: {
                title: {
                  type: 'string'
                },
                year_published: {
                  type: 'number'
                },
                authors: {
                  type: 'array',
                  items: {
                    type: 'object',
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
            },
            revision_count: {
              type: 'number'
            }
          }
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Update project attachment metadata OK'
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

export function updateProjectAttachmentMetadata(): RequestHandler {
  return async (req, res) => {
    defaultLog.debug({
      label: 'updateProjectAttachmentMetadata',
      message: 'params',
      req_params: req.params,
      req_body: req.body
    });

    const connection = getDBConnection(req['keycloak_token']);

    try {
      await connection.open();

      if (req.body.attachment_type === ATTACHMENT_TYPE.REPORT) {
        const metadata = new PutReportAttachmentMetadata({
          ...req.body.attachment_meta,
          revision_count: req.body.revision_count
        });

        const attachmentService = new AttachmentService(connection);

        // Update the metadata fields of the attachment record
        await attachmentService.updateProjectReportAttachmentMetadata(
          Number(req.params.projectId),
          Number(req.params.attachmentId),
          metadata
        );

        // Delete any existing attachment author records
        await attachmentService.deleteProjectReportAttachmentAuthors(Number(req.params.attachmentId));

        const promises = [];

        // Insert any new attachment author records
        promises.push(
          metadata.authors.map((author: IReportAttachmentAuthor) =>
            attachmentService.insertProjectReportAttachmentAuthor(Number(req.params.attachmentId), author)
          )
        );

        await Promise.all(promises);
      }

      await connection.commit();

      return res.status(200).send();
    } catch (error) {
      defaultLog.error({ label: 'updateProjectAttachmentMetadata', message: 'error', error });
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  };
}
