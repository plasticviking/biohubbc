import Ajv from 'ajv';
import { expect } from 'chai';
import sinon from 'sinon';
import { BctwService } from '../../../services/bctw-service';
import { getRequestHandlerMocks } from '../../../__mocks__/db';
import { GET, getDeviceDetails } from './{deviceId}';

describe('getDeviceDetails', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('openapi schema', () => {
    const ajv = new Ajv();

    it('is valid openapi v3 schema', () => {
      expect(ajv.validateSchema((GET.apiDoc as unknown) as object)).to.be.true;
    });
  });

  it('gets device details', async () => {
    const mockGetDeviceDetails = sinon.stub(BctwService.prototype, 'getDeviceDetails').resolves([]);
    const mockGetDeployments = sinon.stub(BctwService.prototype, 'getDeviceDeployments').resolves([]);
    const mockGetKeyXDetails = sinon.stub(BctwService.prototype, 'getKeyXDetails').resolves([]);

    const { mockReq, mockRes, mockNext } = getRequestHandlerMocks();
    const requestHandler = getDeviceDetails();

    await requestHandler(mockReq, mockRes, mockNext);

    expect(mockRes.statusValue).to.equal(200);
    expect(mockGetDeviceDetails).to.have.been.calledOnce;
    expect(mockGetDeployments).to.have.been.calledOnce;
    expect(mockGetKeyXDetails).to.have.been.calledOnce;
  });

  it('catches and re-throws errors', async () => {
    const mockError = new Error('test error');
    const mockGetDeviceDetails = sinon.stub(BctwService.prototype, 'getDeviceDetails').rejects(mockError);

    const { mockReq, mockRes, mockNext } = getRequestHandlerMocks();
    const requestHandler = getDeviceDetails();

    try {
      await requestHandler(mockReq, mockRes, mockNext);
      expect.fail();
    } catch (error) {
      expect(error).to.equal(mockError);
      expect(mockGetDeviceDetails).to.have.been.calledOnce;
      expect(mockNext).not.to.have.been.called;
    }
  });
});
