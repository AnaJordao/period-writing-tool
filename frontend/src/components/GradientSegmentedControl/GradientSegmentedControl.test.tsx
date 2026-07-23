import {
  GradientSegmentedControl,
  type GradientSegmentedControlProps,
} from './GradientSegmentedControl';
import { render } from '../../tests/render';
import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

describe('GradientSegmentedControl', () => {
  const props: GradientSegmentedControlProps = {
    label: 'Sort By',
    data: [
      { value: 'name', label: 'Name' },
      { value: 'createdAt', label: 'Created At' },
      { value: 'updatedAt', label: 'Updated At' },
    ],
    value: 'name',
    onChange: vi.fn(),
  };

  it('renders correctly', () => {
    render(<GradientSegmentedControl {...props} />);

    expect(screen.getByText('Sort By')).toBeInTheDocument();
  });

  it('calls onChange when a segment is clicked', async () => {
    const user = userEvent.setup();

    render(<GradientSegmentedControl {...props} />);

    const segment = screen.getByRole('radio', { name: 'Created At' });
    await user.click(segment);
    expect(props.onChange).toHaveBeenCalledWith('createdAt');
  });

  function Wrapper() {
    const [value, setValue] = React.useState<'name' | 'createdAt' | 'updatedAt' | 'asc' | 'desc'>(
      'name',
    );

    return (
      <GradientSegmentedControl
        value={value}
        onChange={setValue}
        label="Sort By"
        data={props.data}
      />
    );
  }

  it('updates the selected value', async () => {
    const user = userEvent.setup();

    render(<Wrapper />);

    const updated = screen.getByRole('radio', {
      name: /Updated At/i,
    });

    await user.click(updated);

    expect(updated).toBeChecked();
  });
});
