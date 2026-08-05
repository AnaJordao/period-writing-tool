import { Card, Group, SimpleGrid, Text, UnstyledButton, useMantineTheme } from '@mantine/core';
import classes from './ActionGrid.module.css';
import type { IconProps } from '@tabler/icons-react';

interface ActionGridDataProps {
  data: {
    title: string;
    icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;
    color: string;
    onClick: () => void | Promise<void>;
  }[];
  title: string;
}

export function ActionGrid({ data, title }: ActionGridDataProps) {
  const theme = useMantineTheme();

  const items = data.map((item) => (
    <UnstyledButton
      key={item.title}
      className={classes.item}
      onClick={() => {
        void item.onClick();
      }}
    >
      <item.icon color={theme.colors[item.color][6]} size={32} stroke={1.5} />
      <Text size="xs" mt={7}>
        {item.title}
      </Text>
    </UnstyledButton>
  ));

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Group justify="space-between">
        <Text className={classes.title}>{title}</Text>
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} mt="md">
        {items}
      </SimpleGrid>
    </Card>
  );
}
