import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { HighlightText } from './HighlightText';
import { render } from '../../tests/render';

describe('HighlightText', () => {
  it('renders normal text when highlight is empty', () => {
    render(<HighlightText text="My Project" highlight="" />);

    expect(screen.getByText('My Project')).toBeInTheDocument();
    expect(screen.queryByRole('mark')).not.toBeInTheDocument();
  });

  it('highlights matching text', () => {
    render(<HighlightText text="My Project" highlight="Project" />);

    const highlighted = screen.getByText('Project');

    expect(highlighted.tagName).toBe('MARK');
  });

  it('highlights text ignoring case', () => {
    render(<HighlightText text="My project" highlight="PROJECT" />);

    expect(screen.getByText('project').tagName).toBe('MARK');
  });

  it('highlights multiple occurrences', () => {
    render(<HighlightText text="Project one, project two" highlight="project" />);

    const marks = screen.getAllByRole('mark');

    expect(marks).toHaveLength(2);
  });

  it('escapes regex special characters', () => {
    render(<HighlightText text="Version 1.0" highlight="1.0" />);

    const mark = screen.getByText('1.0');

    expect(mark.tagName).toBe('MARK');
  });

  it('does not highlight unmatched text', () => {
    render(<HighlightText text="My Project" highlight="Game" />);

    expect(screen.queryByRole('mark')).not.toBeInTheDocument();
  });
});
