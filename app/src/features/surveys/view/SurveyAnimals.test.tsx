import { AuthStateContext } from 'contexts/authStateContext';
import { IProjectAuthStateContext, ProjectAuthStateContext } from 'contexts/projectAuthStateContext';
import { IProjectContext, ProjectContext } from 'contexts/projectContext';
import { ISurveyContext, SurveyContext } from 'contexts/surveyContext';
import { useBiohubApi } from 'hooks/useBioHubApi';
import { DataLoader } from 'hooks/useDataLoader';
import { useTelemetryApi } from 'hooks/useTelemetryApi';
import { getMockAuthState, SystemAdminAuthState } from 'test-helpers/auth-helpers';
import { cleanup, fireEvent, render, waitFor } from 'test-helpers/test-utils';
import SurveyAnimals from './SurveyAnimals';

jest.mock('../../../hooks/useBioHubApi');
jest.mock('../../../hooks/useTelemetryApi');
const mockBiohubApi = useBiohubApi as jest.Mock;
const mockTelemetryApi = useTelemetryApi as jest.Mock;

const mockUseBiohub = {
  survey: {
    getSurveyCritters: jest.fn(),
    getDeploymentsInSurvey: jest.fn(),
    createCritterAndAddToSurvey: jest.fn(),
    addDeployment: jest.fn()
  }
};

const mockUseTelemetry = {
  devices: {
    getDeviceDetails: jest.fn()
  }
};

describe('SurveyAnimals', () => {
  const mockSurveyContext: ISurveyContext = {
    artifactDataLoader: {
      data: null,
      load: jest.fn()
    } as unknown as DataLoader<any, any, any>,
    surveyId: 1,
    projectId: 1,
    surveyDataLoader: {
      data: { surveyData: { survey_details: { survey_name: 'name' } } },
      load: jest.fn()
    } as unknown as DataLoader<any, any, any>
  } as unknown as ISurveyContext;

  const mockProjectAuthStateContext: IProjectAuthStateContext = {
    getProjectParticipant: () => null,
    hasProjectRole: () => true,
    hasProjectPermission: () => true,
    hasSystemRole: () => true,
    getProjectId: () => 1,
    hasLoadedParticipantInfo: true
  };

  const mockProjectContext: IProjectContext = {
    artifactDataLoader: {
      data: null,
      load: jest.fn()
    } as unknown as DataLoader<any, any, any>,
    projectId: 1,
    projectDataLoader: {
      data: { projectData: { project: { project_name: 'name' } } },
      load: jest.fn()
    } as unknown as DataLoader<any, any, any>
  } as unknown as IProjectContext;

  const authState = getMockAuthState({ base: SystemAdminAuthState });

  beforeEach(() => {
    mockBiohubApi.mockImplementation(() => mockUseBiohub);
    mockUseBiohub.survey.getDeploymentsInSurvey.mockClear();
    mockUseBiohub.survey.getSurveyCritters.mockClear();
    mockUseBiohub.survey.createCritterAndAddToSurvey.mockClear();
    mockUseBiohub.survey.addDeployment.mockClear();

    mockTelemetryApi.mockImplementation(() => mockUseTelemetry);
    mockUseTelemetry.devices.getDeviceDetails.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders correctly with no animals', async () => {
    const { getByText } = render(
      <AuthStateContext.Provider value={authState}>
        <ProjectAuthStateContext.Provider value={mockProjectAuthStateContext}>
          <ProjectContext.Provider value={mockProjectContext}>
            <SurveyContext.Provider value={mockSurveyContext}>
              <SurveyAnimals />
            </SurveyContext.Provider>
          </ProjectContext.Provider>
        </ProjectAuthStateContext.Provider>
      </AuthStateContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('No Individual Animals')).toBeInTheDocument();
    });
  });

  it('renders correctly with animals', async () => {
    mockUseBiohub.survey.getSurveyCritters.mockResolvedValueOnce([
      { critter_id: 'critter_uuid', survey_critter_id: 1, animal_id: 'a', taxon: 'a', created_at: 'a' }
    ]);

    mockUseBiohub.survey.getDeploymentsInSurvey.mockResolvedValue([{ critter_id: 'critter_uuid', device_id: 123 }]);
    mockUseBiohub.survey.createCritterAndAddToSurvey.mockResolvedValue({});
    const { getByText, getByTestId } = render(
      <AuthStateContext.Provider value={authState}>
        <ProjectAuthStateContext.Provider value={mockProjectAuthStateContext}>
          <ProjectContext.Provider value={mockProjectContext}>
            <SurveyContext.Provider value={mockSurveyContext}>
              <SurveyAnimals />
            </SurveyContext.Provider>
          </ProjectContext.Provider>
        </ProjectAuthStateContext.Provider>
      </AuthStateContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('critter_uuid')).toBeInTheDocument();
      expect(getByTestId('survey-animal-table')).toBeInTheDocument();
      fireEvent.click(getByTestId('animal actions'));
      fireEvent.click(getByTestId('animal-table-row-edit-timespan'));
      fireEvent.click(getByText('Save Changes'));
      //fireEvent.click(getByText('Import Animals'));
      //fireEvent.click(getByText('Save Changes'));
    });
  });
});