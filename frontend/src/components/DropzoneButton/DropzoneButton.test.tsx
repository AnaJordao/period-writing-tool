import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import { DropzoneButton } from './DropzoneButton';
import { render } from '../../tests/render';
import userEvent from '@testing-library/user-event';

describe('DropzoneButton', () => {
  beforeEach(() => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the upload area and select files button', () => {
    render(
      <DropzoneButton
        headerFile={null}
        currentHeader={null}
        removeHeader={false}
        onRemoveHeader={vi.fn()}
        setHeader={vi.fn()}
      />,
    );

    expect(screen.getByText(/Upload a cover/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Select files/i })).toBeInTheDocument();
  });

  it('shows preview when headerFile exists', () => {
    const file = new File(['abc'], 'image.png', { type: 'image/png' });

    render(
      <DropzoneButton
        headerFile={file}
        currentHeader={null}
        removeHeader={false}
        onRemoveHeader={vi.fn()}
        setHeader={vi.fn()}
      />,
    );

    expect(screen.getByRole('img')).toHaveAttribute('src', 'blob:test');
  });

  it('shows current header image', () => {
    render(
      <DropzoneButton
        headerFile={null}
        currentHeader="/uploads/header.png"
        removeHeader={false}
        onRemoveHeader={vi.fn()}
        setHeader={vi.fn()}
      />,
    );

    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      expect.stringContaining('/uploads/header.png'),
    );
  });

  it('does not render preview when removeHeader is true', () => {
    render(
      <DropzoneButton
        headerFile={null}
        currentHeader="/uploads/header.png"
        removeHeader
        onRemoveHeader={vi.fn()}
        setHeader={vi.fn()}
      />,
    );

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('removes the preview', async () => {
    const user = userEvent.setup();

    const setHeader = vi.fn();
    const removeHeader = vi.fn();

    const file = new File(['abc'], 'image.png', {
      type: 'image/png',
    });

    render(
      <DropzoneButton
        headerFile={file}
        currentHeader={null}
        removeHeader={false}
        onRemoveHeader={removeHeader}
        setHeader={setHeader}
      />,
    );

    await user.click(screen.getByRole('button', { name: /Remove image/i }));

    expect(setHeader).toHaveBeenCalledWith(null);
    expect(removeHeader).toHaveBeenCalled();
  });

  it('revokes object url when unmounted', () => {
    const revoke = vi.spyOn(URL, 'revokeObjectURL');

    const file = new File(['abc'], 'image.png', {
      type: 'image/png',
    });

    const { unmount } = render(
      <DropzoneButton
        headerFile={file}
        currentHeader={null}
        removeHeader={false}
        onRemoveHeader={vi.fn()}
        setHeader={vi.fn()}
      />,
    );

    unmount();

    expect(revoke).toHaveBeenCalledWith('blob:test');
  });
});
