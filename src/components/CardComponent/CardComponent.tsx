import { IconHeart } from '@tabler/icons-react';
import { ActionIcon, Badge, Button, Card, Group, Image, Text } from '@mantine/core';
import classes from './CardComponent.module.css';
import { normalizeDate } from '../../../shared/utils/normalizeDate';
import placeholderImage from "../../assets/placeholder-image.png";

const API_URL = import.meta.env.VITE_API_URL;

interface CardComponentProps {
  header?: string;
  name: string;
  description?: string;
  badges?: { emoji: string; label: string }[];
  createdAt: string;
}

export function CardComponent({ header, name, description, badges, createdAt }: CardComponentProps) {
  const tags = badges?.map((badge) => (
    <Badge variant="light" key={badge.label} leftSection={badge.emoji}>
      {badge.label}
    </Badge>
  ));

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section>
        {header ? (
          <Image src={`${API_URL}${header}`} alt={name} height={180} />
          ):(
          <Image src={placeholderImage} alt={name} height={180} />
        )}
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
        <Group className={classes.firstSection}>
          <Text className={classes.name} fz="h2" fw={500}>
            {name}
          </Text>
          <Text className={classes.createdTime} c="dimmed" size='xs'>
            {normalizeDate(createdAt)}
          </Text>
        </Group>
        <Text fz="sm" mt="xs">
          {description}
        </Text>
      </Card.Section>

      {tags && (
        <Card.Section className={classes.section}>
          <Text mt="md" className={classes.label} c="dimmed">
            Perfect for you, if you enjoy
          </Text>
          <Group gap={7} mt={5}>
            {tags}
          </Group>
        </Card.Section>
      )}

      <Group mt="xs">
        <Button className="standard-btn" radius="md" style={{ flex: 1 }}>
          Show details
        </Button>
        <ActionIcon variant="default" radius="md" size={36} aria-label="Like">
          <IconHeart className={classes.like} stroke={1.5} />
        </ActionIcon>
      </Group>
    </Card>
  );
}