import chai, { expect } from 'chai';
import { describe } from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import * as get_survey_metadata from './get';
import * as db from '../../../../../../../../database/db';
import * as survey_attachment_queries from '../../../../../../../../queries/survey/survey-attachments-queries';
import SQL from 'sql-template-strings';
import { getMockDBConnection } from '../../../../../../../../__mocks__/db';
import { CustomError } from '../../../../../../../../errors/CustomError';

chai.use(sinonChai);

describe('gets metadata for a survey report', () => {
  const dbConnectionObj = getMockDBConnection();

  const sampleReq = {
    keycloak_token: {},
    body: {},
    params: {
      projectId: 1,
      surveyId: 1,
      attachmentId: 1
    }
  } as any;

  let actualResult: any = null;

  const sampleRes = {
    status: () => {
      return {
        json: (result: any) => {
          actualResult = result;
        }
      };
    }
  };

  afterEach(() => {
    sinon.restore();
  });

  it('should throw a 400 error when no projectId is provided', async () => {
    sinon.stub(db, 'getDBConnection').returns(dbConnectionObj);

    try {
      const result = get_survey_metadata.getSurveyReportMetaData();
      await result(
        { ...sampleReq, params: { ...sampleReq.params, projectId: null } },
        (null as unknown) as any,
        (null as unknown) as any
      );
      expect.fail();
    } catch (actualError) {
      expect((actualError as CustomError).status).to.equal(400);
      expect((actualError as CustomError).message).to.equal('Missing required path param `projectId`');
    }
  });

  it('should throw a 400 error when no surveyId is provided', async () => {
    sinon.stub(db, 'getDBConnection').returns(dbConnectionObj);

    try {
      const result = get_survey_metadata.getSurveyReportMetaData();
      await result(
        { ...sampleReq, params: { ...sampleReq.params, surveyId: null } },
        (null as unknown) as any,
        (null as unknown) as any
      );
      expect.fail();
    } catch (actualError) {
      expect((actualError as CustomError).status).to.equal(400);
      expect((actualError as CustomError).message).to.equal('Missing required path param `surveyId`');
    }
  });

  it('should throw a 400 error when no attachmentId is provided', async () => {
    sinon.stub(db, 'getDBConnection').returns(dbConnectionObj);

    try {
      const result = get_survey_metadata.getSurveyReportMetaData();
      await result(
        { ...sampleReq, params: { ...sampleReq.params, attachmentId: null } },
        (null as unknown) as any,
        (null as unknown) as any
      );
      expect.fail();
    } catch (actualError) {
      expect((actualError as CustomError).status).to.equal(400);
      expect((actualError as CustomError).message).to.equal('Missing required path param `attachmentId`');
    }
  });

  it('should throw a 400 error when no sql statement returned for getProjectReportAttachmentSQL', async () => {
    sinon.stub(db, 'getDBConnection').returns({
      ...dbConnectionObj,
      systemUserId: () => {
        return 20;
      }
    });

    sinon.stub(survey_attachment_queries, 'getSurveyReportAttachmentSQL').returns(null);

    try {
      const result = get_survey_metadata.getSurveyReportMetaData();

      await result(sampleReq, (null as unknown) as any, (null as unknown) as any);
      expect.fail();
    } catch (actualError) {
      expect((actualError as CustomError).status).to.equal(400);
      expect((actualError as CustomError).message).to.equal('Failed to build metadata SQLStatement');
    }
  });

  it('should throw a 400 error when no sql statement returned for getSurveyReportAuthorsSQL', async () => {
    sinon.stub(db, 'getDBConnection').returns({
      ...dbConnectionObj,
      systemUserId: () => {
        return 20;
      }
    });

    sinon.stub(survey_attachment_queries, 'getSurveyReportAuthorsSQL').returns(null);

    try {
      const result = get_survey_metadata.getSurveyReportMetaData();

      await result(sampleReq, (null as unknown) as any, (null as unknown) as any);
      expect.fail();
    } catch (actualError) {
      expect((actualError as CustomError).status).to.equal(400);
      expect((actualError as CustomError).message).to.equal('Failed to build metadata SQLStatement');
    }
  });

  it('should return a project report metadata, on success', async () => {
    const mockQuery = sinon.stub();

    mockQuery.onCall(0).resolves({
      rowCount: 1,
      rows: [
        {
          attachment_id: 1,
          title: 'My report',
          update_date: '2020-10-10',
          description: 'some description',
          year: '2020',
          revision_count: '1'
        }
      ]
    });
    mockQuery.onCall(1).resolves({ rowCount: 1, rows: [{ first_name: 'John', last_name: 'Smith' }] });

    sinon.stub(db, 'getDBConnection').returns({
      ...dbConnectionObj,
      systemUserId: () => {
        return 20;
      },
      query: mockQuery
    });

    sinon.stub(survey_attachment_queries, 'getSurveyReportAttachmentSQL').returns(SQL`something`);
    sinon.stub(survey_attachment_queries, 'getSurveyReportAuthorsSQL').returns(SQL`something`);

    const result = get_survey_metadata.getSurveyReportMetaData();

    await result(sampleReq, sampleRes as any, (null as unknown) as any);

    expect(actualResult).to.be.eql({
      attachment_id: 1,
      title: 'My report',
      last_modified: '2020-10-10',
      description: 'some description',
      year_published: '2020',
      revision_count: '1',
      authors: [{ first_name: 'John', last_name: 'Smith' }]
    });
  });
});