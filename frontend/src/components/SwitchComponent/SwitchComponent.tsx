import { Group, Switch } from '@mantine/core';
import classes from './SwitchComponent.module.css';

interface SwitchComponentProps {
  label: string;
  onChange: () => void;
}

export function SwitchComponent({ label, onChange }: SwitchComponentProps) {
  return (
    <Group justify="center" p="md">
      <Switch
        onChange={onChange}
        labelPosition="left"
        label={label}
        classNames={classes}
        withThumbIndicator={false}
      />
    </Group>
  );
}
