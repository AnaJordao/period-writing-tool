import { Group, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconCircleCheck,
} from "@tabler/icons-react";

export function successNotification(title: string, message: string) {
  notifications.show({
    title: (
      <Group>
        <Text fw={700} style={{ color: "var(--accent)" }}>
          {title}
        </Text>
        <IconCircleCheck size={18} style={{ color: "var(--accent)" }} />
      </Group>
    ),
    message: message,
    color: "violet",
  });
}

export function errorNotification(title: string, message: string) {
  notifications.show({
    title: (
      <Group>
        <Text fw={700} style={{ color: "var(--error-bg)" }}>
          {title}
        </Text>
        <IconAlertCircle size={18} style={{ color: "var(--error-bg)" }} />
      </Group>
    ),
    message: message,
    color: "red",
  });
}