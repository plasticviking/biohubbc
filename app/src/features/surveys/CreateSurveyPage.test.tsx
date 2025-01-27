import { CodesContext, ICodesContext } from 'contexts/codesContext';
import { DialogContextProvider } from 'contexts/dialogContext';
import { IProjectContext, ProjectContext } from 'contexts/projectContext';
import { createMemoryHistory } from 'history';
import { GetRegionsResponse } from 'hooks/api/useSpatialApi';
import { useBiohubApi } from 'hooks/useBioHubApi';
import { DataLoader } from 'hooks/useDataLoader';
import { IGetAllCodeSetsResponse } from 'interfaces/useCodesApi.interface';
import { IGetProjectForViewResponse } from 'interfaces/useProjectApi.interface';
import { ICreateSurveyResponse, ISurveyPermits } from 'interfaces/useSurveyApi.interface';
import { MemoryRouter, Router } from 'react-router';
import { codes } from 'test-helpers/code-helpers';
import { getProjectForViewResponse } from 'test-helpers/project-helpers';
import { getSurveyForListResponse } from 'test-helpers/survey-helpers';
import { cleanup, fireEvent, render, waitFor } from 'test-helpers/test-utils';
import CreateSurveyPage from './CreateSurveyPage';

const history = createMemoryHistory();

jest.mock('../../hooks/useBioHubApi');

const mockBiohubApi = useBiohubApi as jest.Mock;

const mockUseApi = {
  project: {
    getProjectForView: jest.fn<Promise<IGetProjectForViewResponse>, [number]>()
  },
  codes: {
    getAllCodeSets: jest.fn<Promise<IGetAllCodeSetsResponse>, []>()
  },
  survey: {
    getSurveyPermits: jest.fn<Promise<ISurveyPermits>, []>(),
    createSurvey: jest.fn<Promise<ICreateSurveyResponse>, []>()
  },
  taxonomy: {
    searchSpecies: jest.fn().mockResolvedValue({ searchResponse: [] }),
    getSpeciesFromIds: jest.fn().mockResolvedValue({ searchResponse: [] })
  },
  spatial: {
    getRegions: jest.fn<Promise<GetRegionsResponse>, []>()
  }
};

const renderContainer = () => {
  const mockCodesContext: ICodesContext = {
    codesDataLoader: {
      data: codes
    } as DataLoader<any, any, any>
  };
  const mockProjectContext: IProjectContext = {
    projectDataLoader: {
      data: getProjectForViewResponse
    } as DataLoader<any, any, any>,
    artifactDataLoader: { data: null } as DataLoader<any, any, any>,
    surveysListDataLoader: { data: getSurveyForListResponse } as DataLoader<any, any, any>,
    projectId: 1
  };

  return render(
    <DialogContextProvider>
      <Router history={history}>
        <CodesContext.Provider value={mockCodesContext}>
          <ProjectContext.Provider value={mockProjectContext}>
            <CreateSurveyPage />
          </ProjectContext.Provider>
        </CodesContext.Provider>
      </Router>
    </DialogContextProvider>
  );
};

describe.skip('CreateSurveyPage', () => {
  beforeEach(() => {
    mockBiohubApi.mockImplementation(() => mockUseApi);
    mockUseApi.project.getProjectForView.mockClear();
    mockUseApi.codes.getAllCodeSets.mockClear();
    mockUseApi.survey.getSurveyPermits.mockClear();
    mockUseApi.survey.createSurvey.mockClear();
    mockUseApi.taxonomy.getSpeciesFromIds.mockClear();
    mockUseApi.taxonomy.searchSpecies.mockClear();
    mockUseApi.spatial.getRegions.mockClear();

    mockUseApi.spatial.getRegions.mockResolvedValue({
      regions: []
    });

    jest.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
  });

  it.skip('renders the initial default page correctly', async () => {
    mockUseApi.project.getProjectForView.mockResolvedValue(getProjectForViewResponse);
    mockUseApi.codes.getAllCodeSets.mockResolvedValue(codes);
    mockUseApi.survey.getSurveyPermits.mockResolvedValue({
      permits: [{ permit_id: 1, permit_number: 'abcd1', permit_type: 'Wildlife permit' }]
    });

    const { getByText, getAllByText } = renderContainer();

    await waitFor(() => {
      expect(getByText('General Information')).toBeVisible();

      expect(getByText('Purpose and Methodology')).toBeVisible();

      expect(getByText('Study Area')).toBeVisible();

      expect(getByText('Proprietary Data')).toBeVisible();

      expect(getByText('Agreements')).toBeVisible();

      expect(getAllByText('Partnerships')[0]).toBeVisible();
    });
  });

  it('shows circular spinner when codes and project data not yet loaded', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['?id=1']}>
        <CreateSurveyPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });

  it.skip('renders correctly when codes and project data are loaded', async () => {
    mockUseApi.project.getProjectForView.mockResolvedValue(getProjectForViewResponse);

    mockUseApi.codes.getAllCodeSets.mockResolvedValue(codes);

    mockUseApi.survey.getSurveyPermits.mockResolvedValue({
      permits: [
        { permit_id: 1, permit_number: '123', permit_type: 'Scientific' },
        { permit_id: 2, permit_number: '456', permit_type: 'Wildlife' }
      ]
    });

    mockUseApi.taxonomy.getSpeciesFromIds.mockResolvedValue({
      searchResponse: [
        { id: '1', label: 'species 1' },
        { id: '2', label: 'species 2' }
      ]
    });
    mockUseApi.taxonomy.searchSpecies({
      searchResponse: [
        { id: '1', label: 'species 1' },
        { id: '2', label: 'species 2' }
      ]
    });

    const { asFragment, getAllByText } = render(
      <MemoryRouter initialEntries={['?id=1']}>
        <CreateSurveyPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getAllByText('Create Survey').length).toEqual(2);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Are you sure? Dialog', () => {
    it('calls history.push() if the user clicks `Yes`', async () => {
      mockUseApi.project.getProjectForView.mockResolvedValue(getProjectForViewResponse);
      mockUseApi.codes.getAllCodeSets.mockResolvedValue(codes);
      mockUseApi.survey.getSurveyPermits.mockResolvedValue({
        permits: [
          { permit_id: 1, permit_number: '123', permit_type: 'Scientific' },
          { permit_id: 2, permit_number: '456', permit_type: 'Wildlife' }
        ]
      });
      mockUseApi.taxonomy.getSpeciesFromIds.mockResolvedValue({
        searchResponse: [
          { id: '1', label: 'species 1' },
          { id: '2', label: 'species 2' }
        ]
      });
      mockUseApi.taxonomy.searchSpecies({
        searchResponse: [
          { id: '1', label: 'species 1' },
          { id: '2', label: 'species 2' }
        ]
      });

      history.push('/home');
      history.push('/admin/projects/1/survey/create');
      const { getByText, getAllByText, getByTestId } = render(
        <DialogContextProvider>
          <Router history={history}>
            <CreateSurveyPage />
          </Router>
        </DialogContextProvider>
      );
      await waitFor(() => {
        expect(getAllByText('Create Survey').length).toEqual(2);
      });
      fireEvent.click(getByText('Cancel'));
      await waitFor(() => {
        expect(getByText('Discard changes and exit?')).toBeInTheDocument();
        expect(
          getByText('Any changes you have made will not be saved. Do you want to proceed?', { exact: false })
        ).toBeInTheDocument();
      });
      fireEvent.click(getByTestId('yes-button'));
      await waitFor(() => {
        expect(history.location.pathname).toEqual('/admin/projects/1');
      });
    });

    it('does nothing if the user clicks `No` or away from the dialog', async () => {
      mockUseApi.project.getProjectForView.mockResolvedValue(getProjectForViewResponse);
      mockUseApi.codes.getAllCodeSets.mockResolvedValue(codes);
      mockUseApi.survey.getSurveyPermits.mockResolvedValue({
        permits: [
          { permit_id: 1, permit_number: '123', permit_type: 'Scientific' },
          { permit_id: 2, permit_number: '456', permit_type: 'Wildlife' }
        ]
      });
      mockUseApi.taxonomy.getSpeciesFromIds.mockResolvedValue({
        searchResponse: [
          { id: '1', label: 'species 1' },
          { id: '2', label: 'species 2' }
        ]
      });
      mockUseApi.taxonomy.searchSpecies({
        searchResponse: [
          { id: '1', label: 'species 1' },
          { id: '2', label: 'species 2' }
        ]
      });

      const { getAllByText, getByText, getAllByRole, getByTestId } = render(
        <DialogContextProvider>
          <MemoryRouter initialEntries={['?id=1']}>
            <CreateSurveyPage />
          </MemoryRouter>
        </DialogContextProvider>
      );
      await waitFor(() => {
        expect(getAllByText('Create Survey').length).toEqual(2);
      });
      fireEvent.click(getByText('Cancel'));
      await waitFor(() => {
        expect(getByText('Discard changes and exit?')).toBeInTheDocument();
        expect(
          getByText('Any changes you have made will not be saved. Do you want to proceed?', { exact: false })
        ).toBeInTheDocument();
      });
      fireEvent.click(getByTestId('no-button'));
      await waitFor(() => {
        expect(getAllByText('Create Survey').length).toEqual(2);
      });
      fireEvent.click(getByText('Cancel'));
      await waitFor(() => {
        expect(getByText('Discard changes and exit')).toBeInTheDocument();
        expect(
          getByText('Any changes you have made will not be saved. Do you want to proceed?', { exact: false })
        ).toBeInTheDocument();
      });
      // Get the backdrop, then get the firstChild because this is where the event listener is attached
      //@ts-ignore
      fireEvent.click(getAllByRole('presentation')[0].firstChild);
      await waitFor(() => {
        expect(getAllByText('Create Survey').length).toEqual(2);
      });
    });
  });
});
