import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { render } from '../../tests/render';
import ProjectLayout from './ProjectLayout';
import type { Project } from '@period-writing-tool/shared';
import { getProjectById } from '../../services/project.service';
import { errorNotification } from '../../services/notification.services';

const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return {
    ...actual,
    Outlet: () => <div>Outlet Content</div>,
    useNavigate: () => mockedNavigate,
    useParams: () => ({
      projectId: 'project-1',
    }),
  };
});

const mockedProject: Project = {
  id: 'project-1',
  name: 'Test Project',
  description: 'Description',
  header: '/header.jpg',
  isFavorite: false,
  createdAt: '',
  updatedAt: '',
  deletedAt: null,
};

vi.mock('../../services/project.service', () => ({
  getProjectById: vi.fn(),
}));

const mockedGetProjectById = vi.mocked(getProjectById);

vi.mock('../../services/notification.services', () => ({
  errorNotification: vi.fn(),
}));

const mockedErrorNotification = vi.mocked(errorNotification);

vi.mock('../../components/StickyBannerHeader/StickyBannerHeader', () => ({
  StickyBannerHeader: () => <div>Sticky Header</div>,
}));

vi.mock('../../components/ProjectSidebar/ProjectSidebar', () => ({
  ProjectSidebar: () => <div>Sidebar</div>,
}));

describe('ProjectLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the layout', async () => {
    mockedGetProjectById.mockResolvedValue(mockedProject);

    render(<ProjectLayout />);

    expect(screen.getByText('Sticky Header')).toBeInTheDocument();
    expect(screen.getByText('Sidebar')).toBeInTheDocument();
    expect(screen.getByText('Outlet Content')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockedGetProjectById).toHaveBeenCalledWith('project-1');
    });
  });

  it('fetches the project on mount', async () => {
    mockedGetProjectById.mockResolvedValue(mockedProject);

    render(<ProjectLayout />);

    await waitFor(() => {
      expect(mockedGetProjectById).toHaveBeenCalledTimes(1);
      expect(mockedGetProjectById).toHaveBeenCalledWith('project-1');
    });
  });

  it('shows an error notification when fetching fails', async () => {
    mockedGetProjectById.mockRejectedValue(new Error('Fetch failed'));

    render(<ProjectLayout />);

    await waitFor(() => {
      expect(mockedErrorNotification).toHaveBeenCalledWith('Error', 'Fetch failed');
    });
  });
});
