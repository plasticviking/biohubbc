/**
 * Response object for observation update GET request
 */
export const observationUpdateGetResponseObject = {
  title: 'Observation get response object, for update purposes',
  type: 'object',
  properties: {}
};

/**
 * Basic response object for an observation.
 */
export const observationIdResponseObject = {
  title: 'Observation Response Object',
  type: 'object',
  required: ['id'],
  properties: {
    blocks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'number'
          }
        }
      }
    }
  }
};