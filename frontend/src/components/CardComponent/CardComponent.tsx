import { IconEdit, IconHeart, IconHeartFilled, IconRestore } from '@tabler/icons-react';
import { ActionIcon, Badge, Button, Card, Group, Image, Text, Tooltip } from '@mantine/core';
import classes from './CardComponent.module.css';
import { normalizeDate } from '@period-writing-tool/shared';
import placeholderImage from '../../assets/placeholder-image.png';
import { ThreeDotMenu, type MenuItem } from '../ThreeDotMenu/ThreeDotMenu';
import { HighlightText } from '../HighlightText/HighlightText';

const API_URL = import.meta.env.VITE_API_URL;

interface CardComponentProps {
  header?: string;
  name: string;
  description?: string;
  badges: { emoji: string; label: string }[];
  createdAt: string;
  menuItems: MenuItem[];
  search: string;
  isFavorite: boolean;
  isDeleted: boolean;
  handleEditClick: () => void;
  handleFavoriteClick: () => void;
  handleRestoreClick: () => void;
}

export function CardComponent({
  header,
  name,
  description,
  badges,
  createdAt,
  menuItems,
  search,
  isFavorite,
  isDeleted,
  handleEditClick,
  handleFavoriteClick,
  handleRestoreClick,
}: CardComponentProps) {
  const tags = badges.map((badge) => (
    <Badge variant="light" key={badge.label} leftSection={badge.emoji}>
      {badge.label}
    </Badge>
  ));

  return (
    <Card
      data-testid={'project-card'}
      withBorder
      radius="md"
      p="md"
      className={isDeleted ? classes.cardDeleted : classes.card}
    >
      <div className={classes.content}>
        <div className={classes.cover}>
          <ThreeDotMenu menuItems={menuItems} />
          {header ? (
            <Image src={`${API_URL}${header}`} alt={name} height={180} />
          ) : (
            <Image src={placeholderImage} alt={name} height={180} />
          )}
        </div>

        <Card.Section className={classes.section} mt="md">
          <Group className={classes.firstSection}>
            <Text className={classes.name} fz="h2" fw={500}>
              <HighlightText text={name} highlight={search} />
            </Text>
            <Text className={classes.createdTime} c="dimmed" size="xs">
              {normalizeDate(createdAt)}
            </Text>
          </Group>
          <Text fz="sm" mt="xs">
            <HighlightText text={description ?? ''} highlight={search} />
          </Text>
        </Card.Section>
      </div>
      {tags.length > 0 && (
        <Card.Section className={classes.section}>
          <Text mt="md" className={classes.label} c="dimmed">
            Tags
          </Text>
          <Group gap={7} mt={5}>
            {tags}
          </Group>
        </Card.Section>
      )}
      <Group mt="xs" className={classes.buttonsSection}>
        <Button
          disabled={isDeleted}
          className={isDeleted ? 'deleted-btn' : 'standard-btn'}
          radius="md"
          style={{ flex: 1 }}
        >
          Show details
        </Button>
        {!isDeleted && (
          <Tooltip label="Edit project">
            <ActionIcon
              onClick={() => {
                handleEditClick();
              }}
              variant="default"
              radius="md"
              size={36}
              aria-label="Edit project"
            >
              <IconEdit size={20} stroke={1.5} className={classes.editIcon} />
            </ActionIcon>
          </Tooltip>
        )}
        <Tooltip
          label={
            isDeleted ? 'Restore project' : isFavorite ? 'Unfavorite project' : 'Favorite project'
          }
        >
          <ActionIcon
            onClick={
              isDeleted
                ? () => {
                    handleRestoreClick();
                  }
                : () => {
                    handleFavoriteClick();
                  }
            }
            variant="default"
            radius="md"
            size={36}
            aria-label={
              isDeleted ? 'Restore project' : isFavorite ? 'Unfavorite project' : 'Favorite project'
            }
          >
            {isDeleted ? (
              <IconRestore size={20} stroke={1.5} className={classes.restoreIcon} />
            ) : isFavorite ? (
              <IconHeartFilled className={classes.like} stroke={1.5} />
            ) : (
              <IconHeart className={classes.like} stroke={1.5} />
            )}
          </ActionIcon>
        </Tooltip>
      </Group>
    </Card>
  );
}
