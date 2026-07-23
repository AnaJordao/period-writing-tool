import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { CardComponent } from './CardComponent';
import { render } from '../../tests/render';
import { normalizeDate } from '@period-writing-tool/shared';

const menuItems = [
  {
    menuItemLabel: 'Edit project',
    menuItemLabelColor: 'blue',
    onClick: vi.fn(),
    icon: <span />,
  },
];

const defaultProps = {
  name: 'My Project',
  description: 'A test description',
  createdAt: '2026-07-16T12:00:00Z',
  menuItems,
  search: '',
};

describe('CardComponent', () => {
  it('renders the project name and description', () => {
    render(<CardComponent {...defaultProps} />);

    expect(screen.getByText('My Project')).toBeInTheDocument();
    expect(screen.getByText('A test description')).toBeInTheDocument();
  });

  it('renders the formatted creation date', () => {
    render(<CardComponent {...defaultProps} />);

    expect(screen.getByText(normalizeDate(defaultProps.createdAt))).toBeInTheDocument();
  });

  it('renders placeholder image when no header exists', () => {
    render(<CardComponent {...defaultProps} />);

    const image = screen.getByRole('img');

    expect(image).toHaveAttribute('src', expect.stringContaining('placeholder-image'));
  });

  it('renders project header image when header exists', () => {
    render(<CardComponent {...defaultProps} header="/uploads/header.png" />);

    const image = screen.getByRole('img');

    expect(image).toHaveAttribute('src', expect.stringContaining('/uploads/header.png'));
  });

  it('renders badges when provided', () => {
    render(
      <CardComponent
        {...defaultProps}
        badges={[
          {
            emoji: '🎮',
            label: 'Games',
          },
        ]}
      />,
    );

    expect(screen.getByText('Games')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<CardComponent {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Show details' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Like' })).toBeInTheDocument();
  });

  it('highlights matching search text', () => {
    render(<CardComponent {...defaultProps} search="Project" />);

    expect(screen.getByText('Project').tagName).toBe('MARK');
  });
});
