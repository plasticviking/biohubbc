import { RequestHandler } from 'express';
import { Operation } from 'express-openapi';
import { SYSTEM_ROLE } from '../constants/roles';
import { getDBConnection } from '../database/db';
import { authorizeRequestHandler } from '../request-handlers/security/authorization';
import { AccessService, getAllAdministrativeActivityStatusTypes } from '../services/access-service';
import { getLogger } from '../utils/logger';

const defaultLog = getLogger('paths/administrative-activities');

export const GET: Operation = [
  authorizeRequestHandler(() => {
    return {
      and: [
        {
          validSystemRoles: [SYSTEM_ROLE.SYSTEM_ADMIN],
          discriminator: 'SystemRole'
        }
      ]
    };
  }),
  getAdministrativeActivities()
];

GET.apiDoc = {
  description: 'Get a list of administrative activities based on the provided criteria.',
  tags: ['admin'],
  security: [
    {
      Bearer: []
    }
  ],
  parameters: [
    {
      in: 'query',
      name: 'type',
      schema: {
        type: 'string',
        enum: ['System Access']
      }
    },
    {
      in: 'query',
      name: 'status',
      schema: {
        type: 'array',
        items: {
          type: 'string',
          enum: getAllAdministrativeActivityStatusTypes()
        }
      }
    }
  ],
  responses: {
    200: {
      description: 'List of administrative activities.',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  description: 'Administrative activity row ID'
                },
                type: {
                  type: 'number',
                  description: 'Administrative activity type ID'
                },
                type_name: {
                  type: 'string',
                  description: 'Administrative activity type name'
                },
                status: {
                  type: 'number',
                  description: 'Administrative activity status type ID'
                },
                status_name: {
                  type: 'string',
                  description: 'Administrative activity status type name'
                },
                description: {
                  type: 'string',
                  nullable: true
                },
                notes: {
                  type: 'string',
                  nullable: true
                },
                data: {
                  type: 'object',
                  description: 'JSON data blob containing additional information about the activity record',
                  properties: {
                    // Don't specify as this is a JSON blob column
                  }
                },
                create_date: {
                  oneOf: [{ type: 'object' }, { type: 'string', format: 'date' }]
                }
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

/**
 * Get all administrative activities for the specified type, or all if no type is provided.
 *
 * @returns {RequestHandler}
 */
export function getAdministrativeActivities(): RequestHandler {
  return async (req, res) => {
    const connection = getDBConnection(req['keycloak_token']);

    const administrativeActivityTypeName = req.query.type as string;

    const administrativeActivityStatusTypes: string[] =
      (req.query.status as string[]) || getAllAdministrativeActivityStatusTypes();
    try {
      await connection.open();

      const accessService = new AccessService(connection);

      const result = await accessService.getAdministrativeActivities(
        administrativeActivityTypeName,
        administrativeActivityStatusTypes
      );

      await connection.commit();

      return res.status(200).json(result);
    } catch (error) {
      defaultLog.error({ label: 'getAdministrativeActivities', message: 'error', error });
      throw error;
    } finally {
      connection.release();
    }
  };
}
