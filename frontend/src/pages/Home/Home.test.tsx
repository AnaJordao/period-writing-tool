/* eslint-disable @typescript-eslint/require-await */
import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { render } from '../../tests/render';
import { getProjects } from '../../services/project.service';
import userEvent from '@testing-library/user-event';
import { errorNotification } from '../../services/notification.services';
import type { Project } from '@period-writing-tool/shared';
import Home from './Home';

vi.mock('../../services/project.service', () => ({
  getProjects: vi.fn(),
}));

vi.mock('../../services/notification.services', () => ({
  errorNotification: vi.fn(),
}));

vi.mock('../../components/HeaderSearch/HeaderSearch', () => ({
  HeaderSearch: ({
    onClickBtn,
    search,
    onSearchChange,
  }: {
    onClickBtn: () => void;
    search: string;
    onSearchChange: (value: string) => void;
  }) => (
    <>
      <button onClick={onClickBtn}>New Project</button>
      <input
        aria-label="Search"
        value={search}
        onChange={(e) => {
          onSearchChange(e.target.value);
        }}
      />
    </>
  ),
}));

vi.mock('../../components/CardComponent/CardComponent', () => ({
  CardComponent: ({ name, menuItems }: { name: string; menuItems: { onClick: () => void }[] }) => (
    <div data-testid="project-card">
      <span>{name}</span>

      <button onClick={menuItems[0].onClick}>Edit</button>
      <button onClick={menuItems[1].onClick}>Delete</button>
    </div>
  ),
}));

vi.mock('../../components/ProjectModal/ProjectModal', () => ({
  ProjectModal: ({ opened, isUpdateMode }: { opened: boolean; isUpdateMode: boolean }) =>
    opened ? <div>{isUpdateMode ? 'Update Project' : 'Create Project'}</div> : null,
}));

vi.mock('../../components/DeleteModal/DeleteModal', () => ({
  DeleteModal: ({ opened }: { opened: boolean }) => (opened ? <div>Delete Project</div> : null),
}));

describe('Home', () => {
  const projects: Project[] = [
    {
      id: '1',
      name: 'Project One',
      description: 'First project',
      header: undefined,
      isFavorite: false,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      name: 'React App',
      description: 'Second project',
      header: undefined,
      isFavorite: true,
      createdAt: '2026-01-02T00:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z',
    },
  ];

  it('loads projects on mount', async () => {
    vi.mocked(getProjects).mockResolvedValue(projects);

    render(<Home />);

    expect(await screen.findByText('Project One')).toBeInTheDocument();
    expect(screen.getByText('React App')).toBeInTheDocument();

    expect(getProjects).toHaveBeenCalledTimes(1);
  });

  it('filters projects by search', async () => {
    const user = userEvent.setup();

    vi.mocked(getProjects).mockResolvedValue(projects);

    render(<Home />);

    await screen.findByText('Project One');

    await user.type(screen.getByLabelText('Search'), 'react');

    expect(screen.queryByText('Project One')).not.toBeInTheDocument();
    expect(screen.getByText('React App')).toBeInTheDocument();
  });

  it('opens create modal', async () => {
    const user = userEvent.setup();

    vi.mocked(getProjects).mockResolvedValue([]);

    render(<Home />);

    await user.click(screen.getByRole('button', { name: 'New Project' }));

    expect(await screen.findByText('Create Project')).toBeInTheDocument();
  });

  it('opens update modal', async () => {
    const user = userEvent.setup();

    vi.mocked(getProjects).mockResolvedValue(projects);

    render(<Home />);

    await screen.findByText('Project One');

    await user.click(screen.getAllByText('Edit')[0]);

    expect(await screen.findByText('Update Project')).toBeInTheDocument();
  });

  it('opens delete modal', async () => {
    const user = userEvent.setup();

    vi.mocked(getProjects).mockResolvedValue(projects);

    render(<Home />);

    await screen.findByText('Project One');

    await user.click(screen.getAllByText('Delete')[0]);

    expect(await screen.findByText('Delete Project')).toBeInTheDocument();
  });

  it('shows notification when fetching fails', async () => {
    vi.mocked(getProjects).mockRejectedValue(new Error('Server error'));

    vi.spyOn(console, 'error').mockImplementation(vi.fn());

    render(<Home />);

    await waitFor(() => {
      expect(errorNotification).toHaveBeenCalledWith('Error', 'Server error');
    });
  });

  it('renders projects sorted by the API', async () => {
    const user = userEvent.setup();

    vi.mocked(getProjects).mockImplementation(async (sorting) => {
      if (sorting.sortBy === 'updatedAt' && sorting.order === 'desc') {
        return [
          {
            id: '2',
            name: 'Project B',
            updatedAt: '2025-03-01T00:00:00Z',
            createdAt: '2025-01-01T00:00:00Z',
            description: '',
            header: undefined,
            isFavorite: true,
          },
          {
            id: '1',
            name: 'Project A',
            updatedAt: '2025-01-01T00:00:00Z',
            createdAt: '2025-01-01T00:00:00Z',
            description: '',
            header: undefined,
            isFavorite: false,
          },
        ];
      }

      return [
        {
          id: '1',
          name: 'Project A',
          updatedAt: '2025-01-01T00:00:00Z',
          createdAt: '2025-01-01T00:00:00Z',
          description: '',
          header: undefined,
          isFavorite: false,
        },
        {
          id: '2',
          name: 'Project B',
          updatedAt: '2025-03-01T00:00:00Z',
          createdAt: '2025-01-01T00:00:00Z',
          description: '',
          header: undefined,
          isFavorite: true,
        },
      ];
    });

    render(<Home />);

    // Wait for projects to appear
    await screen.findByText('Project A');
    await screen.findByText('Project B');

    // Click Updated At
    await user.click(screen.getByRole('radio', { name: /Date of modification/i }));
    await user.click(screen.getByRole('radio', { name: /Descending/i }));

    // Verify service was called with the correct sorting
    await waitFor(() => {
      expect(getProjects).toHaveBeenCalled();
      expect(getProjects).toHaveBeenLastCalledWith(
        {
          sortBy: 'updatedAt',
          order: 'desc',
        },
        false,
      );
    });

    const projects = screen.getAllByTestId('project-card');
    const names = projects.map((card) => card.textContent);

    expect(names[0]).toContain('Project B');
    expect(names[1]).toContain('Project A');

    // Click Name
    await user.click(screen.getByRole('radio', { name: /Name/i }));
    await user.click(screen.getByRole('radio', { name: /Ascending/i }));

    // Verify service was called with the correct sorting
    await waitFor(() => {
      expect(getProjects).toHaveBeenCalled();
      expect(getProjects).toHaveBeenLastCalledWith(
        {
          sortBy: 'name',
          order: 'asc',
        },
        false,
      );
    });

    const projects2 = screen.getAllByTestId('project-card');
    const names2 = projects2.map((card) => card.textContent);

    expect(names2[0]).toContain('Project A');
    expect(names2[1]).toContain('Project B');
  });

  it('renders projects sorted by the API with only favorites', async () => {
    const user = userEvent.setup();

    vi.mocked(getProjects).mockImplementation(async (sorting, isOnlyFavorites) => {
      if (sorting.sortBy === 'name' && sorting.order === 'asc' && !isOnlyFavorites) {
        return [
          {
            id: '1',
            name: 'Project A',
            updatedAt: '2025-01-01T00:00:00Z',
            createdAt: '2025-01-01T00:00:00Z',
            description: '',
            header: undefined,
            isFavorite: false,
          },
          {
            id: '2',
            name: 'Project B',
            updatedAt: '2025-03-01T00:00:00Z',
            createdAt: '2025-01-01T00:00:00Z',
            description: '',
            header: undefined,
            isFavorite: true,
          },
        ];
      } else if (sorting.sortBy === 'updatedAt' && sorting.order === 'desc' && !isOnlyFavorites) {
        return [
          {
            id: '2',
            name: 'Project B',
            updatedAt: '2025-03-01T00:00:00Z',
            createdAt: '2025-01-01T00:00:00Z',
            description: '',
            header: undefined,
            isFavorite: true,
          },
          {
            id: '1',
            name: 'Project A',
            updatedAt: '2025-01-01T00:00:00Z',
            createdAt: '2025-01-01T00:00:00Z',
            description: '',
            header: undefined,
            isFavorite: false,
          },
        ];
      } else {
        return [
          {
            id: '2',
            name: 'Project B',
            updatedAt: '2025-03-01T00:00:00Z',
            createdAt: '2025-01-01T00:00:00Z',
            description: '',
            header: undefined,
            isFavorite: true,
          },
        ];
      }
    });

    render(<Home />);

    /////////////////////////////////////
    ///// CENARY 1
    ////////////////////////////////////

    // Wait for projects to appear
    await screen.findByText('Project A');
    await screen.findByText('Project B');

    // Click Updated At
    await user.click(screen.getByRole('radio', { name: /Date of modification/i }));
    await user.click(screen.getByRole('radio', { name: /Descending/i }));

    // Verify service was called with the correct sorting
    await waitFor(() => {
      expect(getProjects).toHaveBeenCalled();
      expect(getProjects).toHaveBeenLastCalledWith(
        {
          sortBy: 'updatedAt',
          order: 'desc',
        },
        false,
      );
    });

    const projects = screen.getAllByTestId('project-card');
    const names = projects.map((card) => card.textContent);

    expect(names[0]).toContain('Project B');
    expect(names[1]).toContain('Project A');

    /////////////////////////////////////
    ///// CENARY 2
    ////////////////////////////////////

    // Click Name
    await user.click(screen.getByRole('radio', { name: /Name/i }));
    await user.click(screen.getByRole('radio', { name: /Ascending/i }));
    await user.click(screen.getByRole('switch', { name: /Only favorites/i }));

    // Verify service was called with the correct sorting
    await waitFor(() => {
      expect(getProjects).toHaveBeenCalled();
      expect(getProjects).toHaveBeenLastCalledWith(
        {
          sortBy: 'name',
          order: 'asc',
        },
        true,
      );
    });

    const projects2 = screen.getAllByTestId('project-card');
    const names2 = projects2.map((card) => card.textContent);

    expect(names2[0]).toContain('Project B');

    /////////////////////////////////////
    ///// CENARY 3
    ////////////////////////////////////

    // Click Name
    await user.click(screen.getByRole('radio', { name: /Name/i }));
    await user.click(screen.getByRole('radio', { name: /Ascending/i }));
    await user.click(screen.getByRole('switch', { name: /Only favorites/i }));

    // Verify service was called with the correct sorting
    await waitFor(() => {
      expect(getProjects).toHaveBeenCalled();
      expect(getProjects).toHaveBeenLastCalledWith(
        {
          sortBy: 'name',
          order: 'asc',
        },
        false,
      );
    });

    const projects3 = screen.getAllByTestId('project-card');
    const names3 = projects3.map((card) => card.textContent);

    expect(names3[0]).toContain('Project A');
    expect(names3[1]).toContain('Project B');
  });
});
