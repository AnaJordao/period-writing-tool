import { useState } from "react";
import { Modal, Button, Group } from "@mantine/core";
import { FloatingLabelInput } from "../FloatingLabelInput/FloatingLabelInput";
import { DropzoneButton } from "../DropzoneButton/DropzoneButton";
import classes from "./Modal.module.css";
import { createProject } from "../../services/project.service";
import type { ProjectRequest } from "../../../shared/types/Project/Project";
import { errorNotification, successNotification } from "../../services/notification.services";

interface NewProjectModalProps {
  opened: boolean;
  onClose: () => void;
  onCreate: () => void;
}

export function CreateNewProjectModal({ opened, onClose, onCreate }: NewProjectModalProps)  {
  const [projectRequest, setProjectRequest] = useState<ProjectRequest>({ name: "", description: "", header: null });

  function cleanForm() {
    setProjectRequest({ name: "", description: "", header: null });
  }

  function handleClose() {
    cleanForm();
    onClose();
  }

  async function handleCreate() {
    try {
      await createProject({
        name: projectRequest.name,
        description: projectRequest.description,
        header: projectRequest.header
      });
      
      onCreate();

      successNotification("Project created", "Your project was created successfully!");

      handleClose();

    } catch (error) {
      errorNotification("Error", error instanceof Error ? error.message : "An error occurred while creating the project.");
      console.error(error);
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Create New Project"
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
        onChange={(value) => { setProjectRequest({ ...projectRequest, name: value }); }}
        required
      />

      <FloatingLabelInput
        isTextArea
        label="Project description"
        placeholder="Enter project description"
        value={projectRequest.description}
        onChange={(value) => { setProjectRequest({ ...projectRequest, description: value }); }}
      />

      <DropzoneButton 
        header={projectRequest.header ?? null} 
        setheader={(file) => { setProjectRequest({ ...projectRequest, header: file }); }} 
      />

      <Group justify="flex-end" mt="xl">
        <Button className="error-btn" variant="light" onClick={handleClose}>
          Cancel
        </Button>

        <Button className='standard-btn' onClick={() => {void handleCreate();}}>
          Create
        </Button>
      </Group>
    </Modal>
  );
}