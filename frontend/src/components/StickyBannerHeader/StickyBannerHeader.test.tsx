import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '../../tests/render.tsx';
import userEvent from '@testing-library/user-event';
import { StickyBannerHeader } from './StickyBannerHeader.tsx';

const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

vi.mock('../../hooks/useStickyHeaderProgress', () => ({
  useStickyHeaderProgress: vi.fn(),
}));

import { useStickyHeaderProgress } from '../../hooks/useStickyHeaderProgress';

const mockedStickyHeader = vi.mocked(useStickyHeaderProgress);

vi.mock('../../contexts/ProjectContext', () => ({
  useProject: () => ({
    currentProject: {
      name: 'Test Project',
      description: 'This is a test project',
      header: '/test-header.jpg',
    },
  }),
}));

describe('StickyBannerHeader', () => {
  const toggle = vi.fn();

  beforeEach(() => {
    mockedStickyHeader.mockReturnValue({
      progress: 0,
      wrapperRef: { current: null },
    });

    mockedNavigate.mockClear();
  });

  it('renders the header correctly', () => {
    render(<StickyBannerHeader opened={false} toggle={toggle} />);
    expect(screen.getByLabelText('Project sticky header')).toBeInTheDocument();
  });

  it('navigates back when banner back button is clicked', async () => {
    const user = userEvent.setup();

    mockedStickyHeader.mockReturnValue({
      progress: 0,
      wrapperRef: { current: null },
    });

    render(<StickyBannerHeader opened={false} toggle={toggle} />);

    await user.click(screen.getByLabelText('Go Back banner'));

    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });

  it('navigates back when sticky bar back button is clicked', async () => {
    const user = userEvent.setup();

    mockedStickyHeader.mockReturnValue({
      progress: 1,
      wrapperRef: { current: null },
    });

    render(<StickyBannerHeader opened={false} toggle={toggle} />);

    await screen.findByLabelText('Go Back sticky bar');

    await user.click(screen.getByLabelText('Go Back sticky bar'));
    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });
});
