import chai, { expect } from 'chai';
import { describe } from 'mocha';
import OpenAPIRequestValidator, { OpenAPIRequestValidatorArgs } from 'openapi-request-validator';
import OpenAPIResponseValidator, { OpenAPIResponseValidatorArgs } from 'openapi-response-validator';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import * as db from '../../../../../../database/db';
import { HTTPError } from '../../../../../../errors/http-error';
import { ObservationRecord } from '../../../../../../repositories/observation-repository';
import { ObservationService } from '../../../../../../services/observation-service';
import { getMockDBConnection, getRequestHandlerMocks } from '../../../../../../__mocks__/db';
import * as observationRecords from './index';

chai.use(sinonChai);

describe('insertUpdateSurveyObservations', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('openAPI schema', () => {
    describe('request validation', () => {
      const requestSchema = (observationRecords.PUT.apiDoc as unknown) as OpenAPIRequestValidatorArgs;
      const requestValidator = new OpenAPIRequestValidator(requestSchema);

      describe('should succeed when', () => {
        it('provides an empty array', () => {
          const request = {
            headers: { 'content-type': 'application/json' },
            params: {
              projectId: 4,
              surveyId: 5
            },
            body: { surveyObservations: [] }
          };

          const response = requestValidator.validateRequest(request);

          expect(response).to.equal(undefined);
        });

        it('has valid request values', () => {
          const request = {
            headers: { 'content-type': 'application/json' },
            params: {
              projectId: 4,
              surveyId: 5
            },
            body: {
              surveyObservations: [
                {
                  survey_observation_id: 1,
                  wldtaxonomic_units_id: 1234,
                  count: 99,
                  latitude: 48.103322,
                  longitude: -122.798892,
                  observation_date: '1970-01-01',
                  observation_time: '00:00:00'
                }
              ]
            }
          };

          const response = requestValidator.validateRequest(request);

          expect(response).to.equal(undefined);
        });
      });

      describe('should fail when', () => {
        it('is missing projectId', async () => {
          const request = {
            headers: { 'content-type': 'application/json' },
            params: {
              // projectId: 4,
              surveyId: 5
            },
            body: {
              surveyObservations: [
                {
                  wldtaxonomic_units_id: 1234,
                  count: 99,
                  latitude: 48.103322,
                  longitude: -122.798892,
                  observation_date: '1970-01-01',
                  observation_time: '00:00:00'
                }
              ]
            }
          };

          const response = requestValidator.validateRequest(request);

          expect(response.status).to.equal(400);
          expect(response.errors.length).to.equal(1);
          expect(response.errors[0].path).to.equal('projectId');
          expect(response.errors[0].message).to.equal(`must have required property 'projectId'`);
        });

        it('is missing surveyId', async () => {
          const request = {
            headers: { 'content-type': 'application/json' },
            params: {
              projectId: 4
              // surveyId: 5
            },
            body: {
              surveyObservations: [
                {
                  wldtaxonomic_units_id: 1234,
                  count: 99,
                  latitude: 48.103322,
                  longitude: -122.798892,
                  observation_date: '1970-01-01',
                  observation_time: '00:00:00'
                }
              ]
            }
          };

          const response = requestValidator.validateRequest(request);

          expect(response.status).to.equal(400);
          expect(response.errors.length).to.equal(1);
          expect(response.errors[0].path).to.equal('surveyId');
          expect(response.errors[0].message).to.equal(`must have required property 'surveyId'`);
        });

        it('is missing latitude', async () => {
          const request = {
            headers: {
              'content-type': 'application/json'
            },
            params: {
              projectId: 4,
              surveyId: 5
            },
            body: {
              surveyObservations: [
                {
                  wldtaxonomic_units_id: 1234,
                  count: 99,
                  // latitude: 48.103322,
                  longitude: -122.798892,
                  observation_date: '1970-01-01',
                  observation_time: '00:00:00'
                }
              ]
            }
          };

          const response = requestValidator.validateRequest(request);

          expect(response.status).to.equal(400);
          expect(response.errors.length).to.equal(1);
          expect(response.errors[0].path).to.equal('surveyObservations.0.latitude');
          expect(response.errors[0].message).to.equal(`must have required property 'latitude'`);
        });

        it('is missing longitude', async () => {
          const request = {
            headers: {
              'content-type': 'application/json'
            },
            params: {
              projectId: 4,
              surveyId: 5
            },
            body: {
              surveyObservations: [
                {
                  wldtaxonomic_units_id: 1234,
                  count: 99,
                  latitude: 48.103322,
                  // longitude: -122.798892,
                  observation_date: '1970-01-01',
                  observation_time: '00:00:00'
                }
              ]
            }
          };

          const response = requestValidator.validateRequest(request);

          expect(response.status).to.equal(400);
          expect(response.errors.length).to.equal(1);
          expect(response.errors[0].path).to.equal('surveyObservations.0.longitude');
          expect(response.errors[0].message).to.equal(`must have required property 'longitude'`);
        });

        it('is missing wldtaxonomic_units_id', async () => {
          const request = {
            headers: {
              'content-type': 'application/json'
            },
            params: {
              projectId: 4,
              surveyId: 5
            },
            body: {
              surveyObservations: [
                {
                  // wldtaxonomic_units_id: 1234,
                  count: 99,
                  latitude: 48.103322,
                  longitude: -122.798892,
                  observation_date: '1970-01-01',
                  observation_time: '00:00:00'
                }
              ]
            }
          };

          const response = requestValidator.validateRequest(request);

          expect(response.status).to.equal(400);
          expect(response.errors.length).to.equal(1);
          expect(response.errors[0].path).to.equal('surveyObservations.0.wldtaxonomic_units_id');
          expect(response.errors[0].message).to.equal(`must have required property 'wldtaxonomic_units_id'`);
        });

        it('is missing count', async () => {
          const request = {
            headers: {
              'content-type': 'application/json'
            },
            params: {
              projectId: 4,
              surveyId: 5
            },
            body: {
              surveyObservations: [
                {
                  wldtaxonomic_units_id: 1234,
                  // count: 99,
                  latitude: 48.103322,
                  longitude: -122.798892,
                  observation_date: '1970-01-01',
                  observation_time: '00:00:00'
                }
              ]
            }
          };

          const response = requestValidator.validateRequest(request);

          expect(response.status).to.equal(400);
          expect(response.errors.length).to.equal(1);
          expect(response.errors[0].path).to.equal('surveyObservations.0.count');
          expect(response.errors[0].message).to.equal(`must have required property 'count'`);
        });
      });
    });

    describe('response validation', () => {
      const responseSchema = (observationRecords.PUT.apiDoc as unknown) as OpenAPIResponseValidatorArgs;
      const responseValidator = new OpenAPIResponseValidator(responseSchema);

      describe('should succeed when', () => {
        it('returns an empty array', () => {
          const apiResponse = {
            surveyObservations: []
          };

          const response = responseValidator.validateResponse(200, apiResponse);

          expect(response).to.equal(undefined);
        });

        it('has valid response values', () => {
          const apiResponse = {
            surveyObservations: [
              {
                survey_observation_id: 1,
                wldtaxonomic_units_id: 1234,
                count: 99,
                latitude: 48.103322,
                longitude: -122.798892,
                observation_date: '1970-01-01',
                observation_time: '00:00:00',
                create_user: 1,
                create_date: '1970-01-01',
                update_user: 1,
                update_date: '1970-01-01',
                revision_count: 1
              }
            ]
          };

          const response = responseValidator.validateResponse(200, apiResponse);

          expect(response).to.equal(undefined);
        });
      });

      describe('should fail when', () => {
        it('is missing survey_observation_id', async () => {
          const apiResponse = {
            surveyObservations: [
              {
                // survey_observation_id: 1,
                wldtaxonomic_units_id: 1234,
                count: 99,
                latitude: 48.103322,
                longitude: -122.798892,
                observation_date: '1970-01-01',
                observation_time: '00:00:00',
                create_user: 1,
                create_date: '1970-01-01',
                update_user: 1,
                update_date: '1970-01-01',
                revision_count: 1
              }
            ]
          };

          const response = responseValidator.validateResponse(200, apiResponse);

          expect(response.message).to.equal('The response was not valid.');
          expect(response.errors.length).to.equal(1);
          expect(response.errors[0].path).to.equal('surveyObservations/0');
          expect(response.errors[0].message).to.equal(`must have required property 'survey_observation_id'`);
        });

        it('is missing latitude', async () => {
          const apiResponse = {
            surveyObservations: [
              {
                survey_observation_id: 1,
                wldtaxonomic_units_id: 1234,
                count: 99,
                // latitude: 48.103322,
                longitude: -122.798892,
                observation_date: '1970-01-01',
                observation_time: '00:00:00',
                create_user: 1,
                create_date: '1970-01-01',
                update_user: 1,
                update_date: '1970-01-01',
                revision_count: 1
              }
            ]
          };

          const response = responseValidator.validateResponse(200, apiResponse);

          expect(response.message).to.equal('The response was not valid.');
          expect(response.errors.length).to.equal(1);
          expect(response.errors[0].path).to.equal('surveyObservations/0');
          expect(response.errors[0].message).to.equal(`must have required property 'latitude'`);
        });

        it('is missing longitude', async () => {
          const apiResponse = {
            surveyObservations: [
              {
                survey_observation_id: 1,
                wldtaxonomic_units_id: 1234,
                count: 99,
                latitude: 48.103322,
                // longitude: -122.798892,
                observation_date: '1970-01-01',
                observation_time: '00:00:00',
                create_user: 1,
                create_date: '1970-01-01',
                update_user: 1,
                update_date: '1970-01-01',
                revision_count: 1
              }
            ]
          };

          const response = responseValidator.validateResponse(200, apiResponse);

          expect(response.message).to.equal('The response was not valid.');
          expect(response.errors.length).to.equal(1);
          expect(response.errors[0].path).to.equal('surveyObservations/0');
          expect(response.errors[0].message).to.equal(`must have required property 'longitude'`);
        });

        it('is missing wldtaxonomic_units_id', async () => {
          const apiResponse = {
            surveyObservations: [
              {
                survey_observation_id: 1,
                // wldtaxonomic_units_id: 1234,
                count: 99,
                latitude: 48.103322,
                longitude: -122.798892,
                observation_date: '1970-01-01',
                observation_time: '00:00:00',
                create_user: 1,
                create_date: '1970-01-01',
                update_user: 1,
                update_date: '1970-01-01',
                revision_count: 1
              }
            ]
          };

          const response = responseValidator.validateResponse(200, apiResponse);

          expect(response.message).to.equal('The response was not valid.');
          expect(response.errors.length).to.equal(1);
          expect(response.errors[0].path).to.equal('surveyObservations/0');
          expect(response.errors[0].message).to.equal(`must have required property 'wldtaxonomic_units_id'`);
        });

        it('is missing count', async () => {
          const apiResponse = {
            surveyObservations: [
              {
                survey_observation_id: 1,
                wldtaxonomic_units_id: 1234,
                // count: 99,
                latitude: 48.103322,
                longitude: -122.798892,
                observation_date: '1970-01-01',
                observation_time: '00:00:00',
                create_user: 1,
                create_date: '1970-01-01',
                update_user: 1,
                update_date: '1970-01-01',
                revision_count: 1
              }
            ]
          };

          const response = responseValidator.validateResponse(200, apiResponse);

          expect(response.message).to.equal('The response was not valid.');
          expect(response.errors.length).to.equal(1);
          expect(response.errors[0].path).to.equal('surveyObservations/0');
          expect(response.errors[0].message).to.equal(`must have required property 'count'`);
        });
      });
    });
  });

  it('inserts and updates survey observations', async () => {
    const dbConnectionObj = getMockDBConnection();

    sinon.stub(db, 'getDBConnection').returns(dbConnectionObj);

    const insertUpdateSurveyObservationsStub = sinon
      .stub(ObservationService.prototype, 'insertUpdateSurveyObservations')
      .resolves(([{ survey_observation_id: 1 }, { survey_observation_id: 2 }] as unknown) as ObservationRecord[]);

    const { mockReq, mockRes, mockNext } = getRequestHandlerMocks();

    mockReq.params = {
      projectId: '1',
      surveyId: '2'
    };

    mockReq.body = {
      surveyObservations: [
        {
          survey_observation_id: 1,
          wldtaxonomic_units_id: 1234,
          count: 99,
          latitude: 48.103322,
          longitude: -122.798892,
          observation_date: '1970-01-01',
          observation_time: '00:00:00',
          survey_sample_site_id: 1,
          survey_sample_method_id: 1,
          survey_sample_period_id: 1
        },
        {
          wldtaxonomic_units_id: 1234,
          count: 99,
          latitude: 48.103322,
          longitude: -122.798892,
          observation_date: '1970-01-01',
          observation_time: '00:00:00',
          survey_sample_site_id: 1,
          survey_sample_method_id: 1,
          survey_sample_period_id: 1
        }
      ]
    };

    const requestHandler = observationRecords.insertUpdateSurveyObservations();
    await requestHandler(mockReq, mockRes, mockNext);

    expect(insertUpdateSurveyObservationsStub).to.have.been.calledOnceWith(2, [
      {
        survey_observation_id: 1,
        wldtaxonomic_units_id: 1234,
        latitude: 48.103322,
        longitude: -122.798892,
        count: 99,
        observation_date: '1970-01-01',
        observation_time: '00:00:00',
        survey_sample_site_id: 1,
        survey_sample_method_id: 1,
        survey_sample_period_id: 1
      },
      {
        survey_observation_id: undefined,
        wldtaxonomic_units_id: 1234,
        latitude: 48.103322,
        longitude: -122.798892,
        count: 99,
        observation_date: '1970-01-01',
        observation_time: '00:00:00',
        survey_sample_site_id: 1,
        survey_sample_method_id: 1,
        survey_sample_period_id: 1
      }
    ]);
    expect(mockRes.statusValue).to.equal(200);
    expect(mockRes.jsonValue).to.eql({
      surveyObservations: [{ survey_observation_id: 1 }, { survey_observation_id: 2 }]
    });
  });

  it('catches and re-throws error', async () => {
    const dbConnectionObj = getMockDBConnection({ release: sinon.stub() });

    sinon.stub(db, 'getDBConnection').returns(dbConnectionObj);

    sinon.stub(ObservationService.prototype, 'insertUpdateSurveyObservations').rejects(new Error('a test error'));

    const { mockReq, mockRes, mockNext } = getRequestHandlerMocks();

    mockReq.params = {
      projectId: '1',
      surveyId: '2'
    };

    mockReq.body = {
      surveyObservations: [
        {
          survey_observation_id: 1,
          wldtaxonomic_units_id: 1234,
          count: 99,
          latitude: 48.103322,
          longitude: -122.798892,
          observation_date: '1970-01-01',
          observation_time: '00:00:00'
        }
      ]
    };

    try {
      const requestHandler = observationRecords.insertUpdateSurveyObservations();

      await requestHandler(mockReq, mockRes, mockNext);
      expect.fail();
    } catch (actualError) {
      expect(dbConnectionObj.release).to.have.been.called;

      expect((actualError as HTTPError).message).to.equal('a test error');
    }
  });
});

describe('getSurveyObservations', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('openAPI schema', () => {
    describe('request validation', () => {
      const requestSchema = (observationRecords.GET.apiDoc as unknown) as OpenAPIRequestValidatorArgs;
      const requestValidator = new OpenAPIRequestValidator(requestSchema);

      describe('should fail when', () => {
        it('is missing projectId', async () => {
          const request = {
            headers: { 'content-type': 'application/json' },
            params: {
              // projectId: 4,
              surveyId: 5
            },
            body: {
              surveyObservations: [
                {
                  wldtaxonomic_units_id: 1234,
                  count: 99,
                  latitude: 48.103322,
                  longitude: -122.798892,
                  observation_date: '1970-01-01',
                  observation_time: '00:00:00'
                }
              ],
              supplementaryObservationData: { observationCount: 1 }
            }
          };

          const response = requestValidator.validateRequest(request);

          expect(response.status).to.equal(400);
          expect(response.errors.length).to.equal(1);
          expect(response.errors[0].path).to.equal('projectId');
          expect(response.errors[0].message).to.equal(`must have required property 'projectId'`);
        });

        it('is missing surveyId', async () => {
          const request = {
            headers: { 'content-type': 'application/json' },
            params: {
              projectId: 4
              // surveyId: 5
            },
            body: {
              surveyObservations: [
                {
                  wldtaxonomic_units_id: 1234,
                  count: 99,
                  latitude: 48.103322,
                  longitude: -122.798892,
                  observation_date: '1970-01-01',
                  observation_time: '00:00:00'
                }
              ],
              supplementaryObservationData: { observationCount: 1 }
            }
          };

          const response = requestValidator.validateRequest(request);

          expect(response.status).to.equal(400);
          expect(response.errors.length).to.equal(1);
          expect(response.errors[0].path).to.equal('surveyId');
          expect(response.errors[0].message).to.equal(`must have required property 'surveyId'`);
        });
      });
    });

    describe('response validation', () => {
      const responseSchema = (observationRecords.GET.apiDoc as unknown) as OpenAPIResponseValidatorArgs;
      const responseValidator = new OpenAPIResponseValidator(responseSchema);

      describe('should succeed when', () => {
        it('returns an empty array', () => {
          const apiResponse = {
            surveyObservations: [],
            supplementaryObservationData: { observationCount: 0 },
            pagination: {
              total: 0,
              per_page: undefined,
              current_page: 1,
              last_page: 1,
              sort: undefined,
              order: undefined
            }
          };

          const response = responseValidator.validateResponse(200, apiResponse);

          expect(response).to.equal(undefined);
        });

        it('has valid response values', () => {
          const apiResponse = {
            surveyObservations: [
              {
                survey_observation_id: 1,
                wldtaxonomic_units_id: 1234,
                count: 99,
                latitude: 48.103322,
                longitude: -122.798892,
                observation_date: '1970-01-01',
                observation_time: '00:00:00',
                create_user: 1,
                create_date: '1970-01-01',
                update_user: 1,
                update_date: '1970-01-01',
                revision_count: 1
              }
            ],
            supplementaryObservationData: { observationCount: 1 },
            pagination: {
              total: 1,
              per_page: undefined,
              current_page: 1,
              last_page: 1,
              sort: undefined,
              order: undefined
            }
          };

          const response = responseValidator.validateResponse(200, apiResponse);

          expect(response).to.equal(undefined);
        });
      });

      describe('should fail when', () => {
        it('is missing survey_observation_id', async () => {
          const apiResponse = {
            surveyObservations: [
              {
                // survey_observation_id: 1,
                wldtaxonomic_units_id: 1234,
                count: 99,
                latitude: 48.103322,
                longitude: -122.798892,
                observation_date: '1970-01-01',
                observation_time: '00:00:00',
                create_user: 1,
                create_date: '1970-01-01',
                update_user: 1,
                update_date: '1970-01-01',
                revision_count: 1
              }
            ],
            supplementaryObservationData: { observationCount: 1 },
            pagination: {
              total: 1,
              per_page: undefined,
              current_page: 1,
              last_page: 1,
              sort: undefined,
              order: undefined
            }
          };

          const response = responseValidator.validateResponse(200, apiResponse);

          expect(response.message).to.equal('The response was not valid.');
          expect(response.errors.length).to.equal(1);
          expect(response.errors[0].path).to.equal('surveyObservations/0');
          expect(response.errors[0].message).to.equal(`must have required property 'survey_observation_id'`);
        });

        it('is missing latitude', async () => {
          const apiResponse = {
            surveyObservations: [
              {
                survey_observation_id: 1,
                wldtaxonomic_units_id: 1234,
                count: 99,
                // latitude: 48.103322,
                longitude: -122.798892,
                observation_date: '1970-01-01',
                observation_time: '00:00:00',
                create_user: 1,
                create_date: '1970-01-01',
                update_user: 1,
                update_date: '1970-01-01',
                revision_count: 1
              }
            ],
            supplementaryObservationData: { observationCount: 1 },
            pagination: {
              total: 1,
              per_page: undefined,
              current_page: 1,
              last_page: 1,
              sort: undefined,
              order: undefined
            }
          };

          const response = responseValidator.validateResponse(200, apiResponse);

          expect(response.message).to.equal('The response was not valid.');
          expect(response.errors.length).to.equal(1);
          expect(response.errors[0].path).to.equal('surveyObservations/0');
          expect(response.errors[0].message).to.equal(`must have required property 'latitude'`);
        });

        it('is missing longitude', async () => {
          const apiResponse = {
            surveyObservations: [
              {
                survey_observation_id: 1,
                wldtaxonomic_units_id: 1234,
                count: 99,
                latitude: 48.103322,
                // longitude: -122.798892,
                observation_date: '1970-01-01',
                observation_time: '00:00:00',
                create_user: 1,
                create_date: '1970-01-01',
                update_user: 1,
                update_date: '1970-01-01',
                revision_count: 1
              }
            ],
            supplementaryObservationData: { observationCount: 1 },
            pagination: {
              total: 1,
              per_page: undefined,
              current_page: 1,
              last_page: 1,
              sort: undefined,
              order: undefined
            }
          };

          const response = responseValidator.validateResponse(200, apiResponse);

          expect(response.message).to.equal('The response was not valid.');
          expect(response.errors.length).to.equal(1);
          expect(response.errors[0].path).to.equal('surveyObservations/0');
          expect(response.errors[0].message).to.equal(`must have required property 'longitude'`);
        });

        it('is missing wldtaxonomic_units_id', async () => {
          const apiResponse = {
            surveyObservations: [
              {
                survey_observation_id: 1,
                // wldtaxonomic_units_id: 1234,
                count: 99,
                latitude: 48.103322,
                longitude: -122.798892,
                observation_date: '1970-01-01',
                observation_time: '00:00:00',
                create_user: 1,
                create_date: '1970-01-01',
                update_user: 1,
                update_date: '1970-01-01',
                revision_count: 1
              }
            ],
            supplementaryObservationData: { observationCount: 1 },
            pagination: {
              total: 1,
              per_page: undefined,
              current_page: 1,
              last_page: 1,
              sort: undefined,
              order: undefined
            }
          };

          const response = responseValidator.validateResponse(200, apiResponse);

          expect(response.message).to.equal('The response was not valid.');
          expect(response.errors.length).to.equal(1);
          expect(response.errors[0].path).to.equal('surveyObservations/0');
          expect(response.errors[0].message).to.equal(`must have required property 'wldtaxonomic_units_id'`);
        });

        it('is missing count', async () => {
          const apiResponse = {
            surveyObservations: [
              {
                survey_observation_id: 1,
                wldtaxonomic_units_id: 1234,
                // count: 99,
                latitude: 48.103322,
                longitude: -122.798892,
                observation_date: '1970-01-01',
                observation_time: '00:00:00',
                create_user: 1,
                create_date: '1970-01-01',
                update_user: 1,
                update_date: '1970-01-01',
                revision_count: 1
              }
            ],
            supplementaryObservationData: { observationCount: 1 },
            pagination: {
              total: 1,
              per_page: undefined,
              current_page: 1,
              last_page: 1,
              sort: undefined,
              order: undefined
            }
          };

          const response = responseValidator.validateResponse(200, apiResponse);

          expect(response.message).to.equal('The response was not valid.');
          expect(response.errors.length).to.equal(1);
          expect(response.errors[0].path).to.equal('surveyObservations/0');
          expect(response.errors[0].message).to.equal(`must have required property 'count'`);
        });

        it('is missing pagination', async () => {
          const apiResponse = {
            surveyObservations: [
              {
                survey_observation_id: 1,
                wldtaxonomic_units_id: 1234,
                count: 99,
                latitude: 48.103322,
                longitude: -122.798892,
                observation_date: '1970-01-01',
                observation_time: '00:00:00',
                create_user: 1,
                create_date: '1970-01-01',
                update_user: 1,
                update_date: '1970-01-01',
                revision_count: 1
              }
            ],
            supplementaryObservationData: { observationCount: 1 }
          };

          const response = responseValidator.validateResponse(200, apiResponse);

          expect(response.message).to.equal('The response was not valid.');
          expect(response.errors.length).to.equal(1);
          expect(response.errors[0].path).to.equal('response');
          expect(response.errors[0].message).to.equal(`must have required property 'pagination'`);
        });
      });
    });
  });

  it('retrieves survey observations with pagination', async () => {
    const dbConnectionObj = getMockDBConnection();

    sinon.stub(db, 'getDBConnection').returns(dbConnectionObj);

    const getSurveyObservationsStub = sinon
      .stub(ObservationService.prototype, 'getSurveyObservationsWithSupplementaryAndSamplingData')
      .resolves({
        surveyObservations: ([
          { survey_observation_id: 11 },
          { survey_observation_id: 12 }
        ] as unknown) as ObservationRecord[],
        supplementaryObservationData: { observationCount: 59 }
      });

    const { mockReq, mockRes, mockNext } = getRequestHandlerMocks();

    mockReq.params = {
      projectId: '1',
      surveyId: '2'
    };

    mockReq.query = {
      page: '4',
      limit: '10',
      sort: 'count',
      order: 'asc'
    };

    const requestHandler = observationRecords.getSurveyObservations();
    await requestHandler(mockReq, mockRes, mockNext);

    expect(getSurveyObservationsStub).to.have.been.calledOnceWith(2);
    expect(mockRes.statusValue).to.equal(200);
    expect(mockRes.jsonValue).to.eql({
      surveyObservations: [{ survey_observation_id: 11 }, { survey_observation_id: 12 }],
      supplementaryObservationData: { observationCount: 59 },
      pagination: {
        total: 59,
        current_page: 4,
        last_page: 6,
        order: 'asc',
        per_page: 10,
        sort: 'count'
      }
    });
  });

  it('retrieves survey observations with some pagination options', async () => {
    const dbConnectionObj = getMockDBConnection();

    sinon.stub(db, 'getDBConnection').returns(dbConnectionObj);

    const getSurveyObservationsStub = sinon
      .stub(ObservationService.prototype, 'getSurveyObservationsWithSupplementaryAndSamplingData')
      .resolves({
        surveyObservations: ([
          { survey_observation_id: 16 },
          { survey_observation_id: 17 }
        ] as unknown) as ObservationRecord[],
        supplementaryObservationData: { observationCount: 50 }
      });

    const { mockReq, mockRes, mockNext } = getRequestHandlerMocks();

    mockReq.params = {
      projectId: '1',
      surveyId: '2'
    };

    mockReq.query = {
      page: '2',
      limit: '15'
    };

    const requestHandler = observationRecords.getSurveyObservations();
    await requestHandler(mockReq, mockRes, mockNext);

    expect(getSurveyObservationsStub).to.have.been.calledOnceWith(2);
    expect(mockRes.statusValue).to.equal(200);
    expect(mockRes.jsonValue).to.eql({
      surveyObservations: [{ survey_observation_id: 16 }, { survey_observation_id: 17 }],
      supplementaryObservationData: { observationCount: 50 },
      pagination: {
        total: 50,
        current_page: 2,
        last_page: 4,
        order: undefined,
        per_page: 15,
        sort: undefined
      }
    });
  });

  it('retrieves survey observations with no pagination', async () => {
    const dbConnectionObj = getMockDBConnection();

    sinon.stub(db, 'getDBConnection').returns(dbConnectionObj);

    const getSurveyObservationsStub = sinon
      .stub(ObservationService.prototype, 'getSurveyObservationsWithSupplementaryAndSamplingData')
      .resolves({
        surveyObservations: ([
          { survey_observation_id: 16 },
          { survey_observation_id: 17 }
        ] as unknown) as ObservationRecord[],
        supplementaryObservationData: { observationCount: 2 }
      });

    const { mockReq, mockRes, mockNext } = getRequestHandlerMocks();

    mockReq.params = {
      projectId: '1',
      surveyId: '2'
    };

    const requestHandler = observationRecords.getSurveyObservations();
    await requestHandler(mockReq, mockRes, mockNext);

    expect(getSurveyObservationsStub).to.have.been.calledOnceWith(2);
    expect(mockRes.statusValue).to.equal(200);
    expect(mockRes.jsonValue).to.eql({
      surveyObservations: [{ survey_observation_id: 16 }, { survey_observation_id: 17 }],
      supplementaryObservationData: { observationCount: 2 },
      pagination: {
        total: 2,
        current_page: 1,
        last_page: 1,
        order: undefined,
        per_page: undefined,
        sort: undefined
      }
    });
  });

  it('catches and re-throws error', async () => {
    const dbConnectionObj = getMockDBConnection({ release: sinon.stub() });

    sinon.stub(db, 'getDBConnection').returns(dbConnectionObj);

    sinon
      .stub(ObservationService.prototype, 'getSurveyObservationsWithSupplementaryAndSamplingData')
      .rejects(new Error('a test error'));

    const { mockReq, mockRes, mockNext } = getRequestHandlerMocks();

    mockReq.params = {
      projectId: '1',
      surveyId: '2'
    };

    try {
      const requestHandler = observationRecords.getSurveyObservations();

      await requestHandler(mockReq, mockRes, mockNext);
      expect.fail();
    } catch (actualError) {
      expect(dbConnectionObj.release).to.have.been.called;

      expect((actualError as HTTPError).message).to.equal('a test error');
    }
  });
});