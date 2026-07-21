import { axe } from '@/test-utils';
import attributes from './attributes.json';
import { GradientSegmentedControl } from './GradientSegmentedControl';
import { render } from '../../tests/render';
import { describe, it } from 'vitest';

describe('GradientSegmentedControl', () => {
  axe([<GradientSegmentedControl key="1" {...(attributes as any)} />]);

  it('renders correctly', () => {
    render(<GradientSegmentedControl {...(attributes as any)} />);
  });
});
