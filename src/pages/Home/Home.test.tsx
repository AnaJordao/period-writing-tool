import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { render } from '../../tests/render';
import { getProjects } from '../../services/project.service';
import userEvent from '@testing-library/user-event';
import { errorNotification } from '../../services/notification.services';
import type { Project } from '../../../shared/types/Project/Project';
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
    <div>
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
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      name: 'React App',
      description: 'Second project',
      header: undefined,
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
});
