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

  it('navigates home when banner back button is clicked', async () => {
    const user = userEvent.setup();

    mockedStickyHeader.mockReturnValue({
      progress: 0,
      wrapperRef: { current: null },
    });

    render(<StickyBannerHeader opened={false} toggle={toggle} />);

    await user.click(screen.getByLabelText('Back to projects banner'));

    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates home when sticky bar back button is clicked', async () => {
    const user = userEvent.setup();

    mockedStickyHeader.mockReturnValue({
      progress: 1,
      wrapperRef: { current: null },
    });

    render(<StickyBannerHeader opened={false} toggle={toggle} />);

    await screen.findByLabelText('Back to projects sticky bar');

    await user.click(screen.getByLabelText('Back to projects sticky bar'));
    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });
});
