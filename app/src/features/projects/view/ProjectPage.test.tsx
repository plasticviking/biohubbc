import { cleanup, render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { useBiohubApi } from 'hooks/useBioHubApi';
import { IProjectWithDetails } from 'interfaces/project-interfaces';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Router } from 'react-router';
import ProjectPage from './ProjectPage';

const history = createMemoryHistory({ initialEntries: ['/projects/1'] });

jest.mock('../../../hooks/useBioHubApi');
const mockUseBiohubApi = {
  getProject: jest.fn<Promise<IProjectWithDetails>, [number]>()
};

const mockBiohubApi = ((useBiohubApi as unknown) as jest.Mock<typeof mockUseBiohubApi>).mockReturnValue(
  mockUseBiohubApi
);

describe('ProjectPage', () => {
  beforeEach(() => {
    // clear mocks before each test
    mockBiohubApi().getProject.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders a spinner if no project is loaded', () => {
    const { asFragment } = render(
      <Router history={history}>
        <ProjectPage />
      </Router>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders project page when project is loaded', async () => {
    await act(async () => {
      mockBiohubApi().getProject.mockResolvedValue({
        id: 1,
        project: {
          project_name: 'Test Project Name',
          project_type: '1',
          start_date: '1998-10-10',
          end_date: '2021-02-26',
          climate_change_initiatives: [],
          project_activities: []
        },
        location: {
          location_description: 'here and there',
          regions: [],
          geometry: []
        },
        objectives: {
          objectives: 'Et ad et in culpa si',
          caveats: 'sjwer bds'
        }
      });

      const { asFragment, findByText } = render(
        <Router history={history}>
          <ProjectPage />
        </Router>
      );

      const projectHeaderText = await findByText('Test Project Name', { selector: 'h1' });
      expect(projectHeaderText).toBeVisible();

      expect(asFragment()).toMatchSnapshot();
    });
  });
});