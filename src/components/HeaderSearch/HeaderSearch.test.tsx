import { screen } from '@testing-library/react';
import { HeaderSearch } from './HeaderSearch.tsx';
import { describe, it, expect, vi } from 'vitest';
import { render } from '../../tests/render';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

describe('HeaderSearch', () => {
  it('renders the title', () => {
    render(<HeaderSearch onClickBtn={vi.fn()} search="" onSearchChange={vi.fn()} />);

    expect(screen.getByText('Period - Writing Tool')).toBeInTheDocument();
  });

  it('renders the search input and button', () => {
    render(<HeaderSearch onClickBtn={vi.fn()} search="" onSearchChange={vi.fn()} />);

    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New Project' })).toBeInTheDocument();
  });

  it('calls onClickBtn when the button is clicked', async () => {
    const handleClickBtn = vi.fn();
    const user = userEvent.setup();

    render(<HeaderSearch onClickBtn={handleClickBtn} search="" onSearchChange={vi.fn()} />);

    const button = screen.getByRole('button', { name: 'New Project' });
    await user.click(button);
    expect(handleClickBtn).toHaveBeenCalled();
  });

  it('passes the typed value to onSearchChange', async () => {
    const handleSearchChange = vi.fn();
    const user = userEvent.setup();

    render(<HeaderSearch onClickBtn={vi.fn()} search="" onSearchChange={handleSearchChange} />);

    await user.type(screen.getByPlaceholderText('Search'), 'Project');

    expect(handleSearchChange).toHaveBeenCalledWith('P');
    expect(handleSearchChange).toHaveBeenCalledWith('r');
    expect(handleSearchChange).toHaveBeenCalledWith('o');
    expect(handleSearchChange).toHaveBeenCalledWith('j');
    expect(handleSearchChange).toHaveBeenCalledWith('e');
    expect(handleSearchChange).toHaveBeenCalledWith('c');
    expect(handleSearchChange).toHaveBeenCalledWith('t');
  });

  it('updates the search value when typing', async () => {
    const user = userEvent.setup();

    function Wrapper() {
      const [search, setSearch] = useState('');

      return <HeaderSearch onClickBtn={vi.fn()} search={search} onSearchChange={setSearch} />;
    }

    render(<Wrapper />);

    const input = screen.getByPlaceholderText('Search');

    await user.type(input, 'Project');

    expect(input).toHaveValue('Project');
  });

  it('shows the current search value', () => {
    render(<HeaderSearch onClickBtn={vi.fn()} search="My project" onSearchChange={vi.fn()} />);

    expect(screen.getByDisplayValue('My project')).toBeInTheDocument();
  });

  it('opens the navigation drawer when burger is clicked', async () => {
    const user = userEvent.setup();

    render(<HeaderSearch onClickBtn={vi.fn()} search="" onSearchChange={vi.fn()} />);

    const burger = screen.getByRole('button', {
      name: 'Toggle navigation',
    });

    await user.click(burger);

    // Check if the Text "Navigation" is present in the drawer
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('calls onClickBtn from the drawer', async () => {
    const handleClickBtn = vi.fn();
    const user = userEvent.setup();

    render(<HeaderSearch onClickBtn={handleClickBtn} search="" onSearchChange={vi.fn()} />);

    await user.click(
      screen.getByRole('button', {
        name: 'Toggle navigation',
      }),
    );

    const drawerButton = screen.getAllByRole('button', {
      name: /New Project/i,
    });

    await user.click(drawerButton[drawerButton.length - 1]);

    expect(handleClickBtn).toHaveBeenCalled();
  });

  it('allows clearing the search', async () => {
    const handleSearchChange = vi.fn();
    const user = userEvent.setup();

    render(<HeaderSearch onClickBtn={vi.fn()} search="Test" onSearchChange={handleSearchChange} />);

    const input = screen.getByPlaceholderText('Search');

    await user.clear(input);

    expect(handleSearchChange).toHaveBeenLastCalledWith('');
  });

  it('renders the burger menu button', () => {
    render(<HeaderSearch onClickBtn={vi.fn()} search="" onSearchChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Toggle navigation' })).toBeInTheDocument();
  });
});
