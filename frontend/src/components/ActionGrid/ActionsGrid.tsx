import { Card, Group, SimpleGrid, Text, UnstyledButton, useMantineTheme } from '@mantine/core';
import classes from './ActionGrid.module.css';
import { Fragment } from 'react/jsx-runtime';
import type { DataNavigation } from '../../contexts/ProjectContext';

export interface ActionGridSectionProps {
  sectionName: string;
  sectionData: DataNavigation[];
}

export type ActionGridDataProps =
  | {
      type: 'flat';
      data: DataNavigation[];
      title: string;
    }
  | {
      type: 'sectioned';
      data: ActionGridSectionProps[];
      title: string;
    };

export function ActionGrid({ type, data, title }: ActionGridDataProps) {
  const theme = useMantineTheme();

  function renderItem(item: DataNavigation) {
    return (
      <UnstyledButton
        key={item.title}
        className={classes.item}
        onClick={() => {
          item.onClick();
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
      : data.map((section) => (
          <Fragment key={section.sectionName}>
            {section.sectionName && (
              <Text size="sm" fw={500} mt="md" mb="xs" className={classes.sectionName}>
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
