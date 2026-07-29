import { Group, Switch } from '@mantine/core';
import classes from './SwitchComponent.module.css';

interface SwitchComponentProps {
  label: React.ReactNode | string;
  ariaLabel: string;
  onChange: () => void;
}

export function SwitchComponent({ label, ariaLabel, onChange }: SwitchComponentProps) {
  return (
    <Group justify="center" p="md">
      <Switch
        onChange={onChange}
        labelPosition="left"
        label={label}
        aria-label={ariaLabel}
        classNames={classes}
        withThumbIndicator={false}
      />
    </Group>
  );
}
