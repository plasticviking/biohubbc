import Ajv from 'ajv';
import { expect } from 'chai';
import sinon from 'sinon';
import { HTTPError } from '../../../errors/http-error';
import { BctwService } from '../../../services/bctw-service';
import { getRequestHandlerMocks } from '../../../__mocks__/db';
import { POST, upsertDevice } from './index';

describe('upsertDevice', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('openapi schema', () => {
    const ajv = new Ajv();

    it('is valid openapi v3 schema', () => {
      expect(ajv.validateSchema((POST.apiDoc as unknown) as object)).to.be.true;
    });
  });

  it('upsert device details', async () => {
    const mockUpsertDevice = sinon.stub(BctwService.prototype, 'updateDevice');

    const { mockReq, mockRes, mockNext } = getRequestHandlerMocks();
    const requestHandler = upsertDevice();

    await requestHandler(mockReq, mockRes, mockNext);

    expect(mockRes.statusValue).to.equal(200);
    expect(mockUpsertDevice).to.have.been.calledOnce;
  });

  it('catches and re-throws errors', async () => {
    const mockError = new Error('a test error');
    const mockBctwService = sinon.stub(BctwService.prototype, 'updateDevice').rejects(mockError);

    const { mockReq, mockRes, mockNext } = getRequestHandlerMocks();

    const requestHandler = upsertDevice();
    try {
      await requestHandler(mockReq, mockRes, mockNext);
      expect.fail();
    } catch (actualError) {
      expect((mockError as HTTPError).message).to.eql('a test error');
      expect(mockBctwService.calledOnce).to.be.true;
    }
  });
});
