import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '../../tests/render.tsx';
import userEvent from '@testing-library/user-event';
import { ActionGrid, type ActionGridDataProps } from './ActionsGrid.tsx';
import { IconTestPipe } from '@tabler/icons-react';

describe('ActionGrid', () => {
  const onClick1 = vi.fn();
  const onClick2 = vi.fn();
  const flatDataProps: ActionGridDataProps = {
    title: 'Test Flat Action Grid',
    type: 'flat',
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
  };

  const sectionedDataProps: ActionGridDataProps = {
    title: 'Test Sectioned Action Grid',
    type: 'sectioned',
    data: [
      {
        sectionName: 'Section 1',
        sectionData: [
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
      },
      {
        sectionName: 'Section 2',
        sectionData: [
          {
            title: 'Action 3',
            icon: IconTestPipe,
            color: 'red',
            onClick: vi.fn(),
          },
          {
            title: 'Action 4',
            icon: IconTestPipe,
            color: 'yellow',
            onClick: vi.fn(),
          },
        ],
      },
    ],
  };

  it('renders the title in the flat action grid', () => {
    render(<ActionGrid {...flatDataProps} />);
    expect(screen.getByText('Test Flat Action Grid')).toBeInTheDocument();
  });

  it('renders the title in the sectioned action grid', () => {
    render(<ActionGrid {...sectionedDataProps} />);
    expect(screen.getByText('Test Sectioned Action Grid')).toBeInTheDocument();
  });

  it('renders the flat action items', () => {
    render(<ActionGrid {...flatDataProps} />);
    expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument();
  });

  it('renders the sectioned action items', () => {
    render(<ActionGrid {...sectionedDataProps} />);
    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action 3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action 4' })).toBeInTheDocument();
  });

  it('calls the correct onClick function when an action is clicked', async () => {
    const user = userEvent.setup();
    render(<ActionGrid {...flatDataProps} />);
    const action1 = screen.getByRole('button', { name: 'Action 1' });
    const action2 = screen.getByRole('button', { name: 'Action 2' });
    await user.click(action1);
    expect(onClick1).toHaveBeenCalledTimes(1);
    await user.click(action2);
    expect(onClick2).toHaveBeenCalledTimes(1);
  });
});
