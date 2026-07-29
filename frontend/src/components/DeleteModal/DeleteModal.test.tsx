import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DeleteModal } from './DeleteModal';
import { render } from '../../tests/render';

import { deleteProject, deleteProjectPermanently } from '../../services/project.service';
import { successNotification, errorNotification } from '../../services/notification.services';

vi.mock('../../services/project.service', () => ({
  deleteProject: vi.fn(),
  deleteProjectPermanently: vi.fn(),
}));

vi.mock('../../services/notification.services', () => ({
  successNotification: vi.fn(),
  errorNotification: vi.fn(),
}));

describe('DeleteModal', () => {
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
    },
    isPermanentDelete: false,
    onClose: vi.fn(),
    onDelete: vi.fn(),
  };

  it('renders the confirmation message', () => {
    render(<DeleteModal {...props} />);

    expect(screen.getByText('Are you sure?')).toBeInTheDocument();

    expect(screen.getByText(/This project will be deleted/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Cancel deletion' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('renders the permanent deletion message when isPermanentDelete is true', () => {
    render(<DeleteModal {...props} isPermanentDelete={true} />);

    expect(
      screen.getByText(/This project will be permanently deleted and cannot be recovered/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Permanently Delete' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel deletion' })).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', async () => {
    const user = userEvent.setup();

    render(<DeleteModal {...props} />);

    await user.click(screen.getByRole('button', { name: 'Cancel deletion' }));

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('deletes the project successfully', async () => {
    const user = userEvent.setup();

    vi.mocked(deleteProject).mockResolvedValue(undefined);

    render(<DeleteModal {...props} />);

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(deleteProject).toHaveBeenCalledWith('123');

      expect(props.onDelete).toHaveBeenCalled();

      expect(successNotification).toHaveBeenCalledWith(
        'Project deleted',
        'Your project was deleted successfully!',
      );

      expect(props.onClose).toHaveBeenCalled();
    });
  });

  it('deletes the project permanently when isPermanentDelete is true', async () => {
    const user = userEvent.setup();

    vi.mocked(deleteProjectPermanently).mockResolvedValue(undefined);

    render(<DeleteModal {...props} isPermanentDelete={true} />);

    await user.click(screen.getByRole('button', { name: 'Permanently Delete' }));

    await waitFor(() => {
      expect(deleteProjectPermanently).toHaveBeenCalledWith('123');

      expect(props.onDelete).toHaveBeenCalled();

      expect(successNotification).toHaveBeenCalledWith(
        'Project deleted',
        'Your project was deleted successfully!',
      );

      expect(props.onClose).toHaveBeenCalled();
    });
  });

  it('shows an error notification if deletion fails', async () => {
    const user = userEvent.setup();

    vi.mocked(deleteProject).mockRejectedValue(new Error('Server error'));

    render(<DeleteModal {...props} />);

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(errorNotification).toHaveBeenCalledWith('Error', 'Server error');

      expect(props.onDelete).not.toHaveBeenCalled();
    });
  });

  it('shows an error when project id is missing', async () => {
    const user = userEvent.setup();

    render(
      <DeleteModal
        {...props}
        isPermanentDelete={false}
        projectRequest={{
          name: 'Test',
        }}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(errorNotification).toHaveBeenCalledWith(
        'Error',
        'Project ID is required for deletion.',
      );

      expect(deleteProject).not.toHaveBeenCalled();
    });
  });
});
