import chai, { expect } from 'chai';
import { describe } from 'mocha';
import { QueryResult } from 'pg';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import SQL from 'sql-template-strings';
import { HTTP400 } from '../errors/http-error';
import { queries } from '../queries/queries';
import { getMockDBConnection } from '../__mocks__/db';
import { SubmissionRepository } from './submission-repository';

chai.use(sinonChai);

describe('SubmissionRepository', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('insertSubmissionStatus', () => {
    it('should succeed with valid data', async () => {
      const mockResponse = ({
        rows: [
          {
            id: 1
          }
        ]
      } as any) as Promise<QueryResult<any>>;
      const dbConnection = getMockDBConnection({
        query: () => mockResponse
      });

      const repo = new SubmissionRepository(dbConnection);
      const response = await repo.insertSubmissionStatus(1, 'validated');

      expect(response).to.be.eql(1);
    });

    it('should throw `Failed to build SQL` error', async () => {
      const mockQuery = sinon.stub(queries.survey, 'insertOccurrenceSubmissionStatusSQL').returns(null);
      const dbConnection = getMockDBConnection();
      const repo = new SubmissionRepository(dbConnection);

      try {
        await repo.insertSubmissionStatus(1, 'validated');
        expect(mockQuery).to.be.calledOnce;
        expect.fail();
      } catch (error) {
        expect((error as HTTP400).message).to.be.eql('Failed to build SQL insert statement');
      }
    });

    it('should throw `Failed to update` error', async () => {
      const mockResponse = ({} as any) as Promise<QueryResult<any>>;
      const dbConnection = getMockDBConnection({
        query: () => mockResponse
      });

      const repo = new SubmissionRepository(dbConnection);

      try {
        await repo.insertSubmissionStatus(1, 'validated');
        expect.fail();
      } catch (error) {
        expect((error as HTTP400).message).to.be.eql('Rejected');
      }
    });
  });

  describe('insertSubmissionMessage', () => {
    it('should succeed if no errors are thrown', async () => {
      sinon.stub(queries.survey, 'insertOccurrenceSubmissionMessageSQL').returns(SQL`valid SQL`);

      const mockResponse = ({ rows: [{ submission_message_id: 1 }], rowCount: 1 } as any) as Promise<QueryResult<any>>;
      const dbConnection = getMockDBConnection({
        query: () => mockResponse
      });
      const repo = new SubmissionRepository(dbConnection);

      const response = await repo.insertSubmissionMessage(1, 'validated', '', '');
      expect(response).to.eql({ submission_message_id: 1 });
    });

    it('should throw `Failed to build SQL` error', async () => {
      const mockQuery = sinon.stub(queries.survey, 'insertOccurrenceSubmissionMessageSQL').returns(null);
      const dbConnection = getMockDBConnection();
      const repo = new SubmissionRepository(dbConnection);

      try {
        await repo.insertSubmissionMessage(1, 'validated', '', '');
        expect(mockQuery).to.be.calledOnce;
        expect.fail();
      } catch (error) {
        expect((error as HTTP400).message).to.be.eql('Failed to build SQL insert statement');
      }
    });

    it('should throw `Failed to insert` error', async () => {
      const mockResponse = ({} as any) as Promise<QueryResult<any>>;
      const dbConnection = getMockDBConnection({
        query: () => mockResponse
      });

      const repo = new SubmissionRepository(dbConnection);

      try {
        await repo.insertSubmissionMessage(1, 'validated', 'message', 'error');
        expect.fail();
      } catch (error) {
        expect((error as HTTP400).message).to.be.eql('Failed to insert survey submission message data');
      }
    });
  });
});