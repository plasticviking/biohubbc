import { expect } from 'chai';
import { describe } from 'mocha';
import {
  getPublicProjectSQL,
  getPublicProjectPermitsSQL,
  getLocationByPublicProjectSQL,
  getActivitiesByPublicProjectSQL,
  getIUCNActionClassificationByPublicProjectSQL,
  getFundingSourceByPublicProjectSQL,
  getIndigenousPartnershipsByPublicProjectSQL,
  getStakeholderPartnershipsByPublicProjectSQL,
  getPublicProjectListSQL,
  getPublicProjectAttachmentsSQL,
  getPublicProjectAttachmentS3KeySQL
} from './project-queries';

describe('getPublicProjectSQL', () => {
  it('returns null when null project id param provided', () => {
    const response = getPublicProjectSQL((null as unknown) as number);

    expect(response).to.be.null;
  });

  it('returns non null response when valid project id param provided', () => {
    const response = getPublicProjectSQL(1);

    expect(response).to.not.be.null;
  });
});

describe('getPublicProjectPermitsSQL', () => {
  it('returns null when null project id param provided', () => {
    const response = getPublicProjectPermitsSQL((null as unknown) as number);

    expect(response).to.be.null;
  });

  it('returns non null response when valid project id param provided', () => {
    const response = getPublicProjectPermitsSQL(1);

    expect(response).to.not.be.null;
  });
});

describe('getLocationByPublicProjectSQL', () => {
  it('returns null when null project id param provided', () => {
    const response = getLocationByPublicProjectSQL((null as unknown) as number);

    expect(response).to.be.null;
  });

  it('returns non null response when valid project id param provided', () => {
    const response = getLocationByPublicProjectSQL(1);

    expect(response).to.not.be.null;
  });
});

describe('getActivitiesByPublicProjectSQL', () => {
  it('returns null when null project id param provided', () => {
    const response = getActivitiesByPublicProjectSQL((null as unknown) as number);

    expect(response).to.be.null;
  });

  it('returns non null response when valid project id param provided', () => {
    const response = getActivitiesByPublicProjectSQL(1);

    expect(response).to.not.be.null;
  });
});

describe('getIUCNActionClassificationByPublicProjectSQL', () => {
  it('returns null when null project id param provided', () => {
    const response = getIUCNActionClassificationByPublicProjectSQL((null as unknown) as number);

    expect(response).to.be.null;
  });

  it('returns non null response when valid project id param provided', () => {
    const response = getIUCNActionClassificationByPublicProjectSQL(1);

    expect(response).to.not.be.null;
  });
});

describe('getFundingSourceByPublicProjectSQL', () => {
  it('returns null when null project id param provided', () => {
    const response = getFundingSourceByPublicProjectSQL((null as unknown) as number);

    expect(response).to.be.null;
  });

  it('returns non null response when valid project id param provided', () => {
    const response = getFundingSourceByPublicProjectSQL(1);

    expect(response).to.not.be.null;
  });
});

describe('getIndigenousPartnershipsByPublicProjectSQL', () => {
  it('returns null when null project id param provided', () => {
    const response = getIndigenousPartnershipsByPublicProjectSQL((null as unknown) as number);

    expect(response).to.be.null;
  });

  it('returns non null response when valid project id param provided', () => {
    const response = getIndigenousPartnershipsByPublicProjectSQL(1);

    expect(response).to.not.be.null;
  });
});

describe('getStakeholderPartnershipsByPublicProjectSQL', () => {
  it('returns null when null project id param provided', () => {
    const response = getStakeholderPartnershipsByPublicProjectSQL((null as unknown) as number);

    expect(response).to.be.null;
  });

  it('returns non null response when valid project id param provided', () => {
    const response = getStakeholderPartnershipsByPublicProjectSQL(1);

    expect(response).to.not.be.null;
  });
});

describe('getPublicProjectListSQL', () => {
  it('returns non null response when called', () => {
    const response = getPublicProjectListSQL();

    expect(response).to.not.be.null;
  });
});

describe('getPublicProjectAttachmentsSQL', () => {
  it('returns null when null project id param provided', () => {
    const response = getPublicProjectAttachmentsSQL((null as unknown) as number);

    expect(response).to.be.null;
  });

  it('returns non null response when valid project id param provided', () => {
    const response = getPublicProjectAttachmentsSQL(1);

    expect(response).to.not.be.null;
  });
});

describe('getPublicProjectAttachmentS3KeySQL', () => {
  it('returns null when null attachment id param provided', () => {
    const response = getPublicProjectAttachmentS3KeySQL((null as unknown) as number);

    expect(response).to.be.null;
  });

  it('returns non null response when valid attachment id param provided', () => {
    const response = getPublicProjectAttachmentS3KeySQL(1);

    expect(response).to.not.be.null;
  });
});