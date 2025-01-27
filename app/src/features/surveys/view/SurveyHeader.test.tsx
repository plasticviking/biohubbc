import { AuthStateContext, IAuthState } from 'contexts/authStateContext';
import { DialogContextProvider } from 'contexts/dialogContext';
import { IProjectContext, ProjectContext } from 'contexts/projectContext';
import { ISurveyContext, SurveyContext } from 'contexts/surveyContext';
import SurveyHeader from 'features/surveys/view/SurveyHeader';
import { createMemoryHistory } from 'history';
import { useBiohubApi } from 'hooks/useBioHubApi';
import { DataLoader } from 'hooks/useDataLoader';
import { IGetProjectForViewResponse } from 'interfaces/useProjectApi.interface';
import { IGetSurveyForViewResponse } from 'interfaces/useSurveyApi.interface';
import { Router } from 'react-router';
import { getMockAuthState, SystemAdminAuthState, SystemUserAuthState } from 'test-helpers/auth-helpers';
import { getProjectForViewResponse } from 'test-helpers/project-helpers';
import { getSurveyForViewResponse } from 'test-helpers/survey-helpers';
import { cleanup, fireEvent, render, waitFor } from 'test-helpers/test-utils';

const history = createMemoryHistory({ initialEntries: ['/admin/projects/1/surveys/2'] });

jest.mock('../../../hooks/useBioHubApi');
const mockBiohubApi = useBiohubApi as jest.Mock;

const mockUseApi = {
  survey: {
    publishSurvey: jest.fn(),
    deleteSurvey: jest.fn()
  }
};

const mockSurveyContext: ISurveyContext = {
  surveyDataLoader: {
    data: getSurveyForViewResponse
  } as DataLoader<[project_id: number, survey_id: number], IGetSurveyForViewResponse, unknown>,
  artifactDataLoader: {
    data: null
  } as DataLoader<any, any, any>,
  summaryDataLoader: {
    data: null
  } as DataLoader<any, any, any>,
  observationDataLoader: {
    data: null
  } as DataLoader<any, any, any>,
  sampleSiteDataLoader: {
    data: null
  } as DataLoader<any, any, any>,
  surveyId: 1,
  projectId: 1
};

const mockProjectContext: IProjectContext = {
  projectDataLoader: {
    data: getProjectForViewResponse
  } as DataLoader<[project_id: number], IGetProjectForViewResponse, unknown>,
  artifactDataLoader: {
    data: null
  } as DataLoader<any, any, any>,
  surveysListDataLoader: {
    data: null,
    refresh: () => {}
  } as DataLoader<any, any, any>,
  projectId: 1
};

const surveyForView = getSurveyForViewResponse;

describe('SurveyHeader', () => {
  beforeEach(() => {
    mockBiohubApi.mockImplementation(() => mockUseApi);

    mockUseApi.survey.deleteSurvey.mockResolvedValue(true);
  });

  afterEach(() => {
    cleanup();
  });

  const renderComponent = (authState: IAuthState) => {
    return render(
      <Router history={history}>
        <ProjectContext.Provider value={mockProjectContext}>
          <SurveyContext.Provider value={mockSurveyContext}>
            <AuthStateContext.Provider value={authState}>
              <DialogContextProvider>
                <SurveyHeader />
              </DialogContextProvider>
            </AuthStateContext.Provider>
          </SurveyContext.Provider>
        </ProjectContext.Provider>
      </Router>
    );
  };

  it('deletes survey and takes user to the surveys list page when user is a system administrator', async () => {
    mockUseApi.survey.deleteSurvey.mockResolvedValue(true);

    const authState = getMockAuthState({ base: SystemAdminAuthState });

    const { getByTestId, findByText, getByText } = renderComponent(authState);

    const surveyHeaderText = await findByText('survey name', { selector: 'span' });
    expect(surveyHeaderText).toBeVisible();

    fireEvent.click(getByTestId('delete-survey-button'));

    await waitFor(() => {
      expect(
        getByText('Are you sure you want to delete this survey? This action cannot be undone.')
      ).toBeInTheDocument();
    });

    fireEvent.click(getByTestId('yes-button'));

    await waitFor(() => {
      expect(history.location.pathname).toEqual(
        `/admin/projects/${surveyForView.surveyData.survey_details.project_id}`
      );
    });
  });

  it('does not see the delete button when accessing survey as non admin user', async () => {
    const authState = getMockAuthState({ base: SystemUserAuthState });

    const { queryByTestId, findByText } = renderComponent(authState);

    const surveyHeaderText = await findByText('survey name', { selector: 'span' });
    expect(surveyHeaderText).toBeVisible();

    expect(queryByTestId('delete-survey-button')).toBeNull();
  });
});
