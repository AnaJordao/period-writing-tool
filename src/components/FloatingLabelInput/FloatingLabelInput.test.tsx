import { screen } from '@testing-library/react';
import { FloatingLabelInput } from './FloatingLabelInput';
import { describe, it, expect, vi } from 'vitest';
import { render } from '../../tests/render';
import userEvent from '@testing-library/user-event';

describe('FloatingLabelInput', () => {
  it('renders the label and placeholder', () => {
    render(
      <FloatingLabelInput
        label="Project name"
        placeholder="Enter project name"
        value=""
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByPlaceholderText('Enter project name')).toBeInTheDocument();
  });

  it('renders the current value', () => {
    render(
      <FloatingLabelInput
        label="Project name"
        placeholder="Enter project name"
        value="Fantasy Project"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByDisplayValue('Fantasy Project')).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const user = userEvent.setup();

    const handleChange = vi.fn();

    render(
      <FloatingLabelInput
        label="Project name"
        placeholder="Enter project name"
        value=""
        onChange={handleChange}
      />,
    );

    const input = screen.getByPlaceholderText('Enter project name');

    await user.type(input, 'Fantasy');

    expect(handleChange).toHaveBeenCalled();
  });

  it('renders a textarea when isTextArea is true', () => {
    render(
      <FloatingLabelInput
        isTextArea
        label="Description"
        placeholder="Description"
        value=""
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('textbox')).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('renders an input by default', () => {
    render(
      <FloatingLabelInput
        label="Project name"
        placeholder="Project name"
        value=""
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('textbox')).toBeInstanceOf(HTMLInputElement);
  });

  it('marks the input as required', () => {
    render(<FloatingLabelInput required value="" onChange={vi.fn()} />);

    expect(screen.getByRole('textbox')).toBeRequired();
  });
});
