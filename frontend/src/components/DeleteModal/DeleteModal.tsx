import { Modal, Button, Group, Text } from '@mantine/core';
import classes from './DeleteModal.module.css';
import { deleteProject, deleteProjectPermanently } from '../../services/project.service';
import type { ProjectRequest } from '@period-writing-tool/shared';
import { errorNotification, successNotification } from '../../services/notification.services';

interface DeleteModalProps {
  opened: boolean;
  projectRequest: ProjectRequest;
  onClose: () => void;
  onDelete: () => void;
  isPermanentDelete: boolean;
}

export function DeleteModal({
  opened,
  projectRequest,
  isPermanentDelete,
  onClose,
  onDelete,
}: DeleteModalProps) {
  async function handleDelete() {
    try {
      if (!projectRequest.id) {
        throw new Error('Project ID is required for deletion.');
      }

      if (isPermanentDelete) {
        await deleteProjectPermanently(projectRequest.id);
      } else {
        await deleteProject(projectRequest.id);
      }

      onDelete();

      successNotification('Project deleted', 'Your project was deleted successfully!');

      onClose();
    } catch (error) {
      errorNotification(
        'Error',
        error instanceof Error ? error.message : 'An error occurred while deleting the project.',
      );
      console.error(error);
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Are you sure?"
      centered
      classNames={{
        title: classes.title,
        body: classes.body,
      }}
    >
      <Text className={classes.text}>
        {isPermanentDelete
          ? 'This project will be permanently deleted and cannot be recovered.'
          : 'This project will be deleted, but it can be recovered in the deleted projects section. Are you sure you want to proceed with the deletion?'}
      </Text>

      <Group justify="flex-end" mt="xl">
        <Button
          className="standard-btn"
          variant="light"
          onClick={onClose}
          aria-label="Cancel deletion"
        >
          Cancel
        </Button>

        <Button
          className="error-btn"
          onClick={() => {
            void handleDelete();
          }}
          aria-label="Confirm deletion"
        >
          {isPermanentDelete ? 'Permanently Delete' : 'Delete'}
        </Button>
      </Group>
    </Modal>
  );
}
