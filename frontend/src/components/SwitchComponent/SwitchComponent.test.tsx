import { SwitchComponent } from './SwitchComponent';
import { render } from '../../tests/render';
import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('SwitchComponent', () => {
  it('renders correctly', () => {
    render(<SwitchComponent label="Test Switch" onChange={vi.fn()} />);

    expect(screen.getByRole('switch', { name: 'Test Switch' })).toBeInTheDocument();
  });

  it('calls onChange when clicked', async () => {
    const user = userEvent.setup();

    const onChangeMock = vi.fn();
    render(<SwitchComponent label="Test Switch" onChange={onChangeMock} />);

    const switchElement = screen.getByRole('switch');

    await user.click(switchElement);

    expect(onChangeMock).toHaveBeenCalled();
  });

  it('toggles when clicked', async () => {
    const user = userEvent.setup();

    render(<SwitchComponent label="Test Switch" onChange={vi.fn()} />);

    const switchElement = screen.getByRole('switch', { name: 'Test Switch' });

    expect(switchElement).not.toBeChecked();

    await user.click(switchElement);

    expect(switchElement).toBeChecked();
  });

  it('calls onChange for every click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SwitchComponent label="Test Switch" onChange={onChange} />);

    const switchElement = screen.getByRole('switch');

    await user.click(switchElement);
    await user.click(switchElement);

    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('can be toggled with keyboard', async () => {
    const user = userEvent.setup();

    render(<SwitchComponent label="Test Switch" onChange={vi.fn()} />);

    const switchElement = screen.getByRole('switch', { name: 'Test Switch' });

    switchElement.focus();

    await user.keyboard('[Space]');

    expect(switchElement).toBeChecked();
  });

  it('renders the label', () => {
    render(<SwitchComponent label="Favorites" onChange={vi.fn()} />);

    expect(screen.getByText('Favorites')).toBeInTheDocument();
  });
});
