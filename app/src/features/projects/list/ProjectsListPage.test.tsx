import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import ProjectsListPage from './ProjectsListPage';

// https://stackoverflow.com/questions/58524183/how-to-mock-history-push-with-the-new-react-router-hooks-using-jest/59451956

describe('ProjectsListPage', () => {
  test('renders with the create project button', () => {
    const { baseElement } = render(
      <MemoryRouter>
        <ProjectsListPage />
      </MemoryRouter>
    );

    expect(baseElement).toHaveTextContent('Create Project');
  });
});