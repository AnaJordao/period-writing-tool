import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '../../tests/render.tsx';
import userEvent from '@testing-library/user-event';
import { StickyBannerHeader } from './StickyBannerHeader.tsx';
import { act } from 'react';

const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

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
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 1000,
      bottom: 500, // banner still visible
      width: 1000,
      height: 500,
      toJSON: vi.fn(),
    });
  });

  it('renders the header correctly', () => {
    render(<StickyBannerHeader opened={false} toggle={toggle} />);
    expect(screen.getByLabelText('Project sticky header')).toBeInTheDocument();
  });

  it('navigates home when banner back button is clicked', async () => {
    const user = userEvent.setup();

    render(<StickyBannerHeader opened={false} toggle={toggle} />);

    await user.click(screen.getByLabelText('Back to projects banner'));

    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates home when sticky bar back button is clicked', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 1000,
      bottom: 0, // header collapsed
      width: 1000,
      height: 500,
      toJSON: vi.fn(),
    });

    const user = userEvent.setup();

    render(<StickyBannerHeader opened={false} toggle={toggle} />);

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    await screen.findByLabelText('Back to projects sticky bar');

    await user.click(screen.getByLabelText('Back to projects sticky bar'));
    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });
});
