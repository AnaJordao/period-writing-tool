import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '../../tests/render.tsx';
import userEvent from '@testing-library/user-event';
import { ActionGrid } from './ActionsGrid.tsx';
import { IconTestPipe } from '@tabler/icons-react';

describe('ActionGrid', () => {
  const onClick1 = vi.fn();
  const onClick2 = vi.fn();
  const dataProps = {
    data: [
      {
        title: 'Action 1',
        icon: IconTestPipe,
        color: 'blue',
        onClick: onClick1,
      },
      {
        title: 'Action 2',
        icon: IconTestPipe,
        color: 'green',
        onClick: onClick2,
      },
    ],
    title: 'Test Action Grid',
  };

  it('renders the title', () => {
    render(<ActionGrid {...dataProps} />);
    expect(screen.getByText('Test Action Grid')).toBeInTheDocument();
  });

  it('renders the action items', () => {
    render(<ActionGrid {...dataProps} />);
    expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument();
  });

  it('calls the correct onClick function when an action is clicked', async () => {
    const user = userEvent.setup();
    render(<ActionGrid {...dataProps} />);
    const action1 = screen.getByRole('button', { name: 'Action 1' });
    const action2 = screen.getByRole('button', { name: 'Action 2' });
    await user.click(action1);
    expect(onClick1).toHaveBeenCalledTimes(1);
    await user.click(action2);
    expect(onClick2).toHaveBeenCalledTimes(1);
  });
});
