import { Card, Group, SimpleGrid, Text, UnstyledButton, useMantineTheme } from '@mantine/core';
import classes from './ActionGrid.module.css';
import type { IconProps } from '@tabler/icons-react';
import { Fragment } from 'react/jsx-runtime';

interface ActionGridData {
  title: string;
  icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;
  color: string;
  onClick: () => void | Promise<void>;
}

interface ActionGridSectionProps {
  sectionName?: string;
  sectionData: ActionGridData[];
}

type ActionGridDataProps =
  | {
      type: 'flat';
      data: ActionGridData[];
      title: string;
    }
  | {
      type: 'sectioned';
      data: ActionGridSectionProps[];
      title: string;
    };

export function ActionGrid({ type, data, title }: ActionGridDataProps) {
  const theme = useMantineTheme();

  function renderItem(item: ActionGridData) {
    return (
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
    );
  }

  const items =
    type === 'flat'
      ? data.map((item) => renderItem(item))
      : data.map((section, index) => (
          <Fragment key={section.sectionName ?? index}>
            {section.sectionName && (
              <Text size="sm" fw={500} mt="md" mb="xs">
                {section.sectionName}
              </Text>
            )}

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} mt="md">
              {section.sectionData.map((item) => renderItem(item))}
            </SimpleGrid>
          </Fragment>
        ));

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Group justify="space-between">
        <Text className={classes.title}>{title}</Text>
      </Group>

      {type === 'flat' ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} mt="md">
          {items}
        </SimpleGrid>
      ) : (
        items
      )}
    </Card>
  );
}
