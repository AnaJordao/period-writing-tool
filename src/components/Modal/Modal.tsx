import { useState } from "react";
import { Modal, Button, Group } from "@mantine/core";
import { FloatingLabelInput } from "../FloatingLabelInput/FloatingLabelInput";
import { DropzoneButton } from "../DropzoneButton/DropzoneButton";
import classes from "./Modal.module.css";
import { createProject } from "../../services/project.service";
import type { ProjectRequest } from "../../../shared/types/Project/Project";

interface NewProjectModalProps {
  opened: boolean;
  onClose: () => void;
}

export function CreateNewProjectModal({ opened, onClose}: NewProjectModalProps)  {
  const [projectRequest, setProjectRequest] = useState<ProjectRequest>({ name: "", description: "", headerFile: null });

  function cleanForm() {
    setProjectRequest({ name: "", description: "", headerFile: null });
  }

  function handleClose() {
    cleanForm();
    onClose();
  }

  async function handleCreate() {
    try {
      const project = await createProject({
        name: projectRequest.name,
        description: projectRequest.description,
        headerFile: projectRequest.headerFile
      });

      console.log(project);
      
      handleClose();

    } catch (error) {
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
        headerFile={projectRequest.headerFile ?? null} 
        setHeaderFile={(file) => { setProjectRequest({ ...projectRequest, headerFile: file }); }} 
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