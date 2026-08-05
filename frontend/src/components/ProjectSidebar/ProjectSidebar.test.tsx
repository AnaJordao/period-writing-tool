import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '../../tests/render.tsx';
import userEvent from '@testing-library/user-event';
import { IconTestPipe } from '@tabler/icons-react';
import { ProjectSidebar } from './ProjectSidebar.tsx';

const onClick1 = vi.fn();
const onClick2 = vi.fn();
const onClick3 = vi.fn();
const onClick4 = vi.fn();
const onClick5 = vi.fn();
const onClick6 = vi.fn();

vi.mock('../../contexts/ProjectContext', () => ({
  useProject: () => ({
    dataNavigation: [
      {
        title: 'World Elements',
        icon: IconTestPipe,
        color: 'blue',
        onClick: onClick1,
      },
      {
        title: 'Writing',
        icon: IconTestPipe,
        color: 'orange',
        onClick: onClick2,
      },
      {
        title: 'Brainstorm',
        icon: IconTestPipe,
        color: 'pink',
        onClick: onClick3,
      },
      {
        title: 'Timeline',
        icon: IconTestPipe,
        color: 'green',
        onClick: onClick4,
      },
      {
        title: 'Dashboard',
        icon: IconTestPipe,
        color: 'dark',
        onClick: onClick5,
      },
      {
        title: 'Settings',
        icon: IconTestPipe,
        color: 'gray',
        onClick: onClick6,
      },
    ],
  }),
}));

describe('ProjectSidebar', () => {
  const dataTitles = [
    'World Elements',
    'Writing',
    'Brainstorm',
    'Timeline',
    'Dashboard',
    'Settings',
  ];

  it('renders the sidebar with all navigation items', () => {
    render(<ProjectSidebar opened close={vi.fn()} />);

    dataTitles.forEach((title) => {
      expect(screen.getByRole('button', { name: title })).toBeInTheDocument();
    });
  });

  it('closes correctly', async () => {
    const user = userEvent.setup();

    const close = vi.fn();
    render(<ProjectSidebar opened close={close} />);

    const closeButton = screen.getByRole('button', { name: 'Close sidebar' });
    await user.click(closeButton);
    expect(close).toHaveBeenCalledTimes(1);
  });
});
