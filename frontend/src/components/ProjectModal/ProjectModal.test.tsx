import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ProjectModal } from './ProjectModal';
import { render } from '../../tests/render';

import { createProject, updateProject } from '../../services/project.service';
import { successNotification, errorNotification } from '../../services/notification.services';
import type { Project } from '@period-writing-tool/shared';

vi.mock('../../services/project.service', () => ({
  createProject: vi.fn(),
  updateProject: vi.fn(),
}));

vi.mock('../../services/notification.services', () => ({
  successNotification: vi.fn(),
  errorNotification: vi.fn(),
}));

describe('ProjectModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const props = {
    opened: true,
    projectRequest: {
      id: '123',
      name: 'My project',
      description: 'My project description',
      header: null,
    },
    onClose: vi.fn(),
    onDelete: vi.fn(),
    onClean: vi.fn(),
    onSave: vi.fn(),
    setProjectRequest: vi.fn(),
  };

  it('renders create mode', () => {
    render(<ProjectModal {...props} isUpdateMode={false} />);

    expect(screen.getByText('Create New Project')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  it('renders update mode', () => {
    render(<ProjectModal {...props} isUpdateMode />);

    expect(screen.getByText('Update Project')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument();
  });

  it('calls onClean and onClose when cancel is clicked', async () => {
    const user = userEvent.setup();

    render(<ProjectModal {...props} isUpdateMode />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(props.onClean).toHaveBeenCalled();
    expect(props.onClose).toHaveBeenCalled();
    expect(screen.queryByText('Project Modal')).not.toBeInTheDocument();
  });

  it('type project name', async () => {
    const user = userEvent.setup();

    render(<ProjectModal {...props} isUpdateMode={false} />);

    await user.type(screen.getByRole('textbox', { name: /project name/i }), 'My Project');

    expect(props.setProjectRequest).toHaveBeenCalled();
  });

  it('type project description', async () => {
    const user = userEvent.setup();

    render(<ProjectModal {...props} isUpdateMode={false} />);

    await user.type(
      screen.getByRole('textbox', { name: /project description/i }),
      'My project description',
    );

    expect(props.setProjectRequest).toHaveBeenCalled();
  });

  it('creates a project', async () => {
    vi.mocked(createProject).mockResolvedValue({} as Project);

    const user = userEvent.setup();

    render(<ProjectModal {...props} isUpdateMode={false} />);

    await user.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => {
      expect(createProject).toHaveBeenCalledWith({
        name: props.projectRequest.name,
        description: props.projectRequest.description,
        header: props.projectRequest.header,
      });

      expect(props.onSave).toHaveBeenCalled();
      expect(props.onClean).toHaveBeenCalled();
      expect(props.onClose).toHaveBeenCalled();

      expect(successNotification).toHaveBeenCalled();
    });
  });

  it('updates a project', async () => {
    const user = userEvent.setup();

    vi.mocked(updateProject).mockResolvedValue({} as Project);

    const updateProps = {
      ...props,
      isUpdateMode: true,
      projectRequest: {
        ...props.projectRequest,
        id: '123',
      },
    };

    render(<ProjectModal {...updateProps} />);

    await user.click(screen.getByRole('button', { name: 'Update' }));

    await waitFor(() => {
      expect(updateProject).toHaveBeenCalled();
      expect(props.onSave).toHaveBeenCalled();
      expect(props.onClean).toHaveBeenCalled();
      expect(props.onClose).toHaveBeenCalled();
    });
  });

  it('shows an error if updating without id', async () => {
    const user = userEvent.setup();

    vi.mocked(updateProject).mockResolvedValue({} as Project);

    render(
      <ProjectModal
        {...props}
        isUpdateMode
        projectRequest={{
          ...props.projectRequest,
          id: undefined,
        }}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Update' }));

    expect(errorNotification).toHaveBeenCalledWith('Error', 'Project ID is required for update.');
  });

  it('shows an error notification if creation fails', async () => {
    const user = userEvent.setup();
    vi.mocked(createProject).mockRejectedValue(new Error('Server error'));

    render(<ProjectModal {...props} isUpdateMode={false} />);

    await user.click(screen.getByRole('button', { name: 'Create' }));
    await waitFor(() => {
      expect(errorNotification).toHaveBeenCalledWith('Error', 'Server error');
    });
  });

  it('shows an error when project name is empty', async () => {
    const user = userEvent.setup();
    vi.mocked(createProject).mockRejectedValue({});

    render(
      <ProjectModal
        {...props}
        isUpdateMode={false}
        projectRequest={{
          ...props.projectRequest,
          name: '',
        }}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(errorNotification).toHaveBeenCalledWith('Error', 'Project name is required.');
  });
});
