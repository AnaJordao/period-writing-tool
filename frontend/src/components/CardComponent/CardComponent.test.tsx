import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { CardComponent } from './CardComponent';
import { render } from '../../tests/render';
import { normalizeDate } from '@period-writing-tool/shared';
import userEvent from '@testing-library/user-event';

const menuItems = [
  {
    menuItemLabel: 'Edit project',
    menuItemLabelColor: 'blue',
    onClick: vi.fn(),
    icon: <span />,
  },
];

const defaultProps = {
  name: 'My Project',
  description: 'A test description',
  createdAt: '2026-07-16T12:00:00Z',
  menuItems,
  search: '',
  deletedAt: null,
  isFavorite: false,
  isDeleted: false,
  handleFavoriteClick: vi.fn(),
  handleRestoreClick: vi.fn(),
  handleEditClick: vi.fn(),
};

describe('CardComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the project name and description', () => {
    render(<CardComponent {...defaultProps} />);

    expect(screen.getByText('My Project')).toBeInTheDocument();
    expect(screen.getByText('A test description')).toBeInTheDocument();
  });

  it('renders the formatted creation date', () => {
    render(<CardComponent {...defaultProps} />);

    expect(screen.getByText(normalizeDate(defaultProps.createdAt))).toBeInTheDocument();
  });

  it('renders placeholder image when no header exists', () => {
    render(<CardComponent {...defaultProps} />);

    const image = screen.getByRole('img');

    expect(image).toHaveAttribute('src', expect.stringContaining('placeholder-image'));
  });

  it('renders project header image when header exists', () => {
    render(<CardComponent {...defaultProps} header="/uploads/header.png" />);

    const image = screen.getByRole('img');

    expect(image).toHaveAttribute('src', expect.stringContaining('/uploads/header.png'));
  });

  it('renders correct action buttons when project is not deleted', () => {
    render(<CardComponent {...defaultProps} isDeleted={false} />);

    expect(screen.getByRole('button', { name: 'Show details' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit project' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Favorite project' })).toBeInTheDocument();
  });

  it('renders correct action buttons when project is deleted', () => {
    render(<CardComponent {...defaultProps} isDeleted={true} />);

    expect(screen.getByRole('button', { name: 'Show details' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Restore project' })).toBeInTheDocument();
  });

  it('highlights matching search text', () => {
    render(<CardComponent {...defaultProps} search="Project" />);

    expect(screen.getByText('Project').tagName).toBe('MARK');
  });

  // it('does not let user click on the Show Information button when the project is deleted', async () => {
  //   const user = userEvent.setup();

  //   render(<CardComponent {...defaultProps} isDeleted={true} />);

  //   await user.click(screen.getByRole('button', { name: 'Show details' }));

  //   expect(defaultProps.handleEditClick).not.toHaveBeenCalled();
  // });

  it('renders the edit button in the bottom of the card when the project is not deleted', () => {
    render(<CardComponent {...defaultProps} isDeleted={false} />);

    expect(screen.getByRole('button', { name: 'Edit project' })).toBeInTheDocument();
  });

  it('shows the restore button when the project is deleted', () => {
    render(<CardComponent {...defaultProps} isDeleted={true} />);

    expect(screen.getByRole('button', { name: 'Restore project' })).toBeInTheDocument();
  });

  it('should be able to click the restore button when the project is deleted', async () => {
    const user = userEvent.setup();

    render(<CardComponent {...defaultProps} isDeleted={true} />);

    await user.click(screen.getByRole('button', { name: 'Restore project' }));

    expect(defaultProps.handleRestoreClick).toHaveBeenCalled();
  });

  it('shows the favorite button when the project is not deleted', () => {
    render(<CardComponent {...defaultProps} isDeleted={false} />);

    expect(screen.getByRole('button', { name: 'Favorite project' })).toBeInTheDocument();
  });

  it('calls handleFavoriteClick when the favorite button is clicked', async () => {
    const user = userEvent.setup();

    render(<CardComponent {...defaultProps} isFavorite={false} />);

    await user.click(screen.getByRole('button', { name: 'Favorite project' }));

    expect(defaultProps.handleFavoriteClick).toHaveBeenCalled();
  });

  it('shows the heart icon filled when the project is a favorite', () => {
    render(<CardComponent {...defaultProps} isFavorite={true} />);

    expect(screen.getByTestId('heart-filled-icon')).toBeInTheDocument();
  });

  it('shows the heart icon unfilled when the project is not a favorite', () => {
    render(<CardComponent {...defaultProps} isFavorite={false} />);

    expect(screen.getByTestId('heart-unfilled-icon')).toBeInTheDocument();
  });

  it('show the Favorite badge when the project is a favorite', () => {
    render(<CardComponent {...defaultProps} isFavorite={true} isDeleted={false} />);
    expect(screen.getByText('Favorited')).toBeInTheDocument();
    expect(screen.queryByText('Deleted')).not.toBeInTheDocument();
  });

  it('show the Deleted badge when the project is deleted', () => {
    render(<CardComponent {...defaultProps} isFavorite={false} isDeleted={true} />);
    expect(screen.queryByText('Favorited')).not.toBeInTheDocument();
    expect(screen.getByText('Deleted')).toBeInTheDocument();
  });

  it('shows the Favorite and Deleted badges when the project is both a favorite and deleted', () => {
    render(<CardComponent {...defaultProps} isFavorite={true} isDeleted={true} />);
    expect(screen.getByText('Favorited')).toBeInTheDocument();
    expect(screen.getByText('Deleted')).toBeInTheDocument();
  });

  it('does not show any badges when the project is neither a favorite nor deleted', () => {
    render(<CardComponent {...defaultProps} isFavorite={false} isDeleted={false} />);

    expect(screen.queryByText('Favorited')).not.toBeInTheDocument();
    expect(screen.queryByText('Deleted')).not.toBeInTheDocument();
  });
});
