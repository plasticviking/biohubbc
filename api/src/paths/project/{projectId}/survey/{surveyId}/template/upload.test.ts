import chai, { expect } from 'chai';
import { describe } from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import SQL from 'sql-template-strings';
import * as db from '../../../../../../database/db';
import * as survey_occurrence_queries from '../../../../../../queries/survey/survey-occurrence-queries';
import * as file_utils from '../../../../../../utils/file-utils';
import * as upload from './upload';

chai.use(sinonChai);

describe('uploadMedia', () => {
  afterEach(() => {
    sinon.restore();
  });

  const dbConnectionObj = {
    systemUserId: () => {
      return null;
    },
    open: async () => {
      // do nothing
    },
    release: () => {
      // do nothing
    },
    commit: async () => {
      // do nothing
    },
    rollback: async () => {
      // do nothing
    },
    query: async () => {
      // do nothing
    }
  };

  const mockReq = {
    keycloak_token: {},
    params: {
      projectId: 1,
      surveyId: 2
    },
    body: {},
    files: [
      {
        fieldname: 'media',
        originalname: 'test.txt',
        encoding: '7bit',
        mimetype: 'text/plain',
        size: 340
      }
    ]
  } as any;

  let actualStatus = 0;

  const mockRes = {
    status: (status: number) => {
      actualStatus = status;

      return {
        send: () => {
          // do nothing
        }
      };
    }
  } as any;

  const mockNext = {} as any;

  it('should throw a 400 error when files are missing', async () => {
    sinon.stub(db, 'getDBConnection').returns(dbConnectionObj);

    try {
      const result = upload.uploadMedia();

      await result({ ...mockReq, files: [] }, mockRes, mockNext);
      expect.fail();
    } catch (actualError) {
      expect(actualError.status).to.equal(400);
      expect(actualError.message).to.equal('Missing upload data');
    }
  });

  it('should throw a 400 error when more than 1 file uploaded', async () => {
    sinon.stub(db, 'getDBConnection').returns(dbConnectionObj);

    try {
      const result = upload.uploadMedia();

      await result({ ...mockReq, files: ['file1', 'file2'] }, mockRes, mockNext);
      expect.fail();
    } catch (actualError) {
      expect(actualError.status).to.equal(400);
      expect(actualError.message).to.equal('Too many files uploaded, expected 1');
    }
  });

  it('should throw a 400 error when projectId is missing', async () => {
    sinon.stub(db, 'getDBConnection').returns(dbConnectionObj);

    try {
      const result = upload.uploadMedia();

      await result({ ...mockReq, params: { ...mockReq.params, projectId: null } }, mockRes, mockNext);
      expect.fail();
    } catch (actualError) {
      expect(actualError.status).to.equal(400);
      expect(actualError.message).to.equal('Missing required path param: projectId');
    }
  });

  it('should throw a 400 error when surveyId is missing', async () => {
    sinon.stub(db, 'getDBConnection').returns(dbConnectionObj);

    try {
      const result = upload.uploadMedia();

      await result({ ...mockReq, params: { ...mockReq.params, surveyId: null } }, mockRes, mockNext);
      expect.fail();
    } catch (actualError) {
      expect(actualError.status).to.equal(400);
      expect(actualError.message).to.equal('Missing required path param: surveyId');
    }
  });

  it('should throw a 400 error when no sql statement returned', async () => {
    sinon.stub(db, 'getDBConnection').returns(dbConnectionObj);

    sinon.stub(survey_occurrence_queries, 'insertSurveyOccurrenceSubmissionSQL').returns(null);

    const result = upload.uploadMedia();

    try {
      await result(mockReq, mockRes, mockNext);
      expect.fail();
    } catch (actualError) {
      expect(actualError.status).to.equal(400);
      expect(actualError.message).to.equal('Failed to build SQL insert statement');
    }
  });

  it('should throw a 400 error when it fails to insert a record in the database', async () => {
    const mockQuery = sinon.stub();

    mockQuery.resolves({ rowCount: 0 });

    sinon.stub(db, 'getDBConnection').returns({
      ...dbConnectionObj,
      systemUserId: () => {
        return 20;
      },
      query: mockQuery
    });

    sinon.stub(survey_occurrence_queries, 'insertSurveyOccurrenceSubmissionSQL').returns(SQL`some query`);

    const result = upload.uploadMedia();

    try {
      await result(mockReq, mockRes, mockNext);
      expect.fail();
    } catch (actualError) {
      expect(actualError.status).to.equal(400);
      expect(actualError.message).to.equal('Failed to insert survey occurrence submission record');
    }
  });

  it('should throw a 400 error when it fails to insert a record in S3', async () => {
    const mockQuery = sinon.stub();

    mockQuery.resolves({ rowCount: 1 });

    sinon.stub(db, 'getDBConnection').returns({
      ...dbConnectionObj,
      systemUserId: () => {
        return 20;
      },
      query: mockQuery
    });

    sinon.stub(survey_occurrence_queries, 'insertSurveyOccurrenceSubmissionSQL').returns(SQL`some query`);

    sinon.stub(file_utils, 'uploadFileToS3').rejects('Upload was not successful');

    const result = upload.uploadMedia();

    try {
      await result(mockReq, mockRes, mockNext);
      expect.fail();
    } catch (actualError) {
      expect(actualError.status).to.equal(500);
      expect(actualError.message).to.equal('Upload was not successful');
    }
  });

  it('should return 200 on success', async () => {
    const mockQuery = sinon.stub();

    mockQuery.resolves({ rowCount: 1 });

    sinon.stub(db, 'getDBConnection').returns({
      ...dbConnectionObj,
      systemUserId: () => {
        return 20;
      },
      query: mockQuery
    });

    sinon.stub(survey_occurrence_queries, 'insertSurveyOccurrenceSubmissionSQL').returns(SQL`some query`);

    sinon.stub(file_utils, 'uploadFileToS3').resolves();

    const result = upload.uploadMedia();

    await result(mockReq, mockRes, mockNext);

    expect(actualStatus).to.equal(200);
  });
});