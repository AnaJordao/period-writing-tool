import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThreeDotMenu, type MenuItem } from './ThreeDotMenu';
import { render } from '../../tests/render';

describe('ThreeDotMenu', () => {
  let editHandler: Mock<() => void>;
  let deleteHandler: Mock<() => void>;
  let menuItems: MenuItem[];

  beforeEach(() => {
    editHandler = vi.fn<() => void>();
    deleteHandler = vi.fn<() => void>();

    menuItems = [
      {
        hasMenuLabel: 'Actions',
        menuItemLabel: 'Edit project',
        menuItemLabelColor: 'blue',
        onClick: editHandler,
        hasDivider: true,
        icon: <span data-testid="edit-icon" />,
      },
      {
        menuItemLabel: 'Delete project',
        menuItemLabelColor: 'red',
        onClick: deleteHandler,
        icon: <span data-testid="delete-icon" />,
      },
    ];
  });

  it('renders the menu button', () => {
    render(<ThreeDotMenu menuItems={menuItems} />);

    expect(screen.getByRole('button', { name: 'Open three-dot menu' })).toBeInTheDocument();
  });

  it('opens the menu when clicking the button', async () => {
    const user = userEvent.setup();

    render(<ThreeDotMenu menuItems={menuItems} />);

    await user.click(screen.getByRole('button', { name: 'Open three-dot menu' }));

    expect(await screen.findByRole('menuitem', { name: 'Edit project' })).toBeInTheDocument();
  });

  it('renders menu labels', async () => {
    const user = userEvent.setup();

    render(<ThreeDotMenu menuItems={menuItems} />);

    await user.click(screen.getByRole('button', { name: 'Open three-dot menu' }));

    expect(await screen.findByText('Actions')).toBeInTheDocument();
  });

  it('calls the correct callback when clicking an item', async () => {
    const user = userEvent.setup();

    render(<ThreeDotMenu menuItems={menuItems} />);

    await user.click(screen.getByRole('button', { name: 'Open three-dot menu' }));
    await user.click(await screen.findByText('Edit project'));

    await user.click(screen.getByRole('button', { name: 'Open three-dot menu' }));
    await user.click(await screen.findByText('Delete project'));

    expect(editHandler).toHaveBeenCalledTimes(1);
    expect(deleteHandler).toHaveBeenCalledTimes(1);
  });

  it('renders icons inside menu items', async () => {
    const user = userEvent.setup();

    render(<ThreeDotMenu menuItems={menuItems} />);

    await user.click(screen.getByRole('button', { name: 'Open three-dot menu' }));

    expect(await screen.findByTestId('edit-icon')).toBeInTheDocument();
    expect(await screen.findByTestId('delete-icon')).toBeInTheDocument();
  });
});
