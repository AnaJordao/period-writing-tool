import { Group, SegmentedControl, Text } from '@mantine/core';
import classes from './GradientSegmentedControl.module.css';
import type { ProjectSorting } from '@period-writing-tool/shared';

interface GradientSegmentedControlProps {
  label: string;
  data: { value: ProjectSorting['sortBy'] | ProjectSorting['order']; label: string }[];
  value: ProjectSorting['sortBy'] | ProjectSorting['order'];
  onChange: (value: ProjectSorting['sortBy'] | ProjectSorting['order']) => void;
}

export function GradientSegmentedControl({
  label,
  data,
  value,
  onChange,
}: GradientSegmentedControlProps) {
  return (
    <Group>
      <Text size="sm" color="dimmed" className={classes.label}>
        {label}
      </Text>
      <SegmentedControl
        aria-label={label}
        radius="xl"
        size="md"
        data={data}
        classNames={classes}
        value={value}
        onChange={onChange}
      />
    </Group>
  );
}
