import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { SurveyCritterRepository } from '../repositories/survey-critter-repository';
import { getMockDBConnection } from '../__mocks__/db';
import { SurveyCritterService } from './survey-critter-service';

chai.use(sinonChai);

describe('SurveyService', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('getCrittersInSurvey', () => {
    it('returns the first row on success', async () => {
      const dbConnection = getMockDBConnection();
      const service = new SurveyCritterService(dbConnection);

      const data = [
        {
          survey_id: 1,
          critter_id: 1,
          critterbase_critter_id: 'critter_id'
        }
      ];

      const repoStub = sinon.stub(SurveyCritterRepository.prototype, 'getCrittersInSurvey').resolves(data);

      const response = await service.getCrittersInSurvey(1);

      expect(repoStub).to.be.calledOnce;
      expect(response).to.eql(data);
    });
  });

  describe('addCritterToSurvey', () => {
    it('returns the first row on success', async () => {
      const dbConnection = getMockDBConnection();
      const service = new SurveyCritterService(dbConnection);

      const repoStub = sinon.stub(SurveyCritterRepository.prototype, 'addCritterToSurvey').resolves(1);

      const response = await service.addCritterToSurvey(1, 'critter_id');

      expect(repoStub).to.be.calledOnce;
      expect(response).to.eql(1);
    });
  });

  describe('removeCritterFromSurvey', () => {
    it('returns the first row on success', async () => {
      const dbConnection = getMockDBConnection();
      const service = new SurveyCritterService(dbConnection);

      const repoStub = sinon.stub(SurveyCritterRepository.prototype, 'removeCritterFromSurvey').resolves(1);

      const response = await service.removeCritterFromSurvey(1);

      expect(repoStub).to.be.calledOnce;
      expect(response).to.eql(1);
    });
  });

  describe('addDeployment', () => {
    it('returns the first row on success', async () => {
      const dbConnection = getMockDBConnection();
      const service = new SurveyCritterService(dbConnection);

      const repoStub = sinon.stub(SurveyCritterRepository.prototype, 'upsertDeployment').resolves(1);

      const response = await service.upsertDeployment(1, 'deployment_id');

      expect(repoStub).to.be.calledOnce;
      expect(response).to.eql(1);
    });
  });
});