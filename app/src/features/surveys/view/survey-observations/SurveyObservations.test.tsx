import { cleanup, render, waitFor } from '@testing-library/react';
import { ISurveyContext, SurveyContext } from 'contexts/surveyContext';
import { useBiohubApi } from 'hooks/useBioHubApi';
import { DataLoader } from 'hooks/useDataLoader';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { getObservationSubmissionResponse } from 'test-helpers/survey-helpers';
import SurveyObservations from './SurveyObservations';

jest.mock('../../../../hooks/useBioHubApi');
const mockUseBiohubApi = {
  observation: {
    uploadObservationSubmission: jest.fn(),
    processDWCFile: jest.fn(),
    deleteObservationSubmission: jest.fn(),
    getObservationSubmissionSignedURL: jest.fn()
  }
};

((useBiohubApi as unknown) as jest.Mock<typeof mockUseBiohubApi>).mockReturnValue(mockUseBiohubApi);

describe('SurveyObservations', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    const mockSurveyContext: ISurveyContext = {
      observationDataLoader: ({
        data: getObservationSubmissionResponse,
        load: jest.fn(),
        refresh: jest.fn()
      } as unknown) as DataLoader<any, any, any>,
      artifactDataLoader: ({} as unknown) as DataLoader<any, any, any>,
      surveyDataLoader: ({} as unknown) as DataLoader<any, any, any>,
      summaryDataLoader: ({} as unknown) as DataLoader<any, any, any>,
      surveyId: 1,
      projectId: 1
    };

    const { getByText } = render(
      <MemoryRouter>
        <SurveyContext.Provider value={mockSurveyContext}>
          <SurveyObservations />
        </SurveyContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText('Observations')).toBeInTheDocument();
    });
  });
});