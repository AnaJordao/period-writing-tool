import { Modal, Button, Group } from '@mantine/core';
import { FloatingLabelInput } from '../FloatingLabelInput/FloatingLabelInput';
import { DropzoneButton } from '../DropzoneButton/DropzoneButton';
import classes from './ProjectModal.module.css';
import { createProject, updateProject } from '../../services/project.service';
import type { ProjectRequest } from '../../../shared/types/Project/Project';
import { errorNotification, successNotification } from '../../services/notification.services';

interface ProjectModalProps {
  opened: boolean;
  projectRequest: ProjectRequest;
  setProjectRequest: React.Dispatch<React.SetStateAction<ProjectRequest>>;
  onClose: () => void;
  onSave: () => void;
  onClean: () => void;
  isUpdateMode: boolean;
}

export function ProjectModal({
  opened,
  projectRequest,
  setProjectRequest,
  onClose,
  onSave,
  onClean,
  isUpdateMode,
}: ProjectModalProps) {
  function handleClose() {
    onClean();
    onClose();
  }

  async function handleSave() {
    try {
      if (isUpdateMode) {
        if (!projectRequest.id) {
          throw new Error('Project ID is required for update.');
        }
        await updateProject(projectRequest.id, {
          name: projectRequest.name,
          description: projectRequest.description,
          header: projectRequest.header,
          removeHeader: projectRequest.removeHeader,
        });
      } else {
        await createProject({
          name: projectRequest.name,
          description: projectRequest.description,
          header: projectRequest.header,
        });
      }

      onSave();

      successNotification(
        isUpdateMode ? 'Project updated' : 'Project created',
        isUpdateMode
          ? 'Your project was updated successfully!'
          : 'Your project was created successfully!',
      );

      handleClose();
    } catch (error) {
      errorNotification(
        'Error',
        error instanceof Error ? error.message : 'An error occurred while creating the project.',
      );
      console.error(error);
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={isUpdateMode ? 'Update Project' : 'Create New Project'}
      centered
      classNames={{
        title: classes.title,
        body: classes.body,
      }}
    >
      <FloatingLabelInput
        label="Project name"
        placeholder="Enter project name"
        value={projectRequest.name}
        onChange={(value) => {
          setProjectRequest({ ...projectRequest, name: value });
        }}
        required
      />

      <FloatingLabelInput
        isTextArea
        label="Project description"
        placeholder="Enter project description"
        value={projectRequest.description}
        onChange={(value) => {
          setProjectRequest({ ...projectRequest, description: value });
        }}
      />

      <DropzoneButton
        headerFile={projectRequest.header ?? null}
        currentHeader={projectRequest.currentHeader ?? null}
        removeHeader={projectRequest.removeHeader ?? false}
        setHeader={(file) => {
          setProjectRequest({
            ...projectRequest,
            header: file,
          });
        }}
        onRemoveHeader={() => {
          setProjectRequest({
            ...projectRequest,
            removeHeader: true,
            currentHeader: null,
          });
        }}
      />

      <Group justify="flex-end" mt="xl">
        <Button className="error-btn" variant="light" onClick={handleClose}>
          Cancel
        </Button>

        <Button
          className="standard-btn"
          onClick={() => {
            void handleSave();
          }}
        >
          {isUpdateMode ? 'Update' : 'Create'}
        </Button>
      </Group>
    </Modal>
  );
}
