import { useState } from "react";
import { Modal, Button, Group } from "@mantine/core";
import { FloatingLabelInput } from "../FloatingLabelInput/FloatingLabelInput";
import { DropzoneButton } from "../DropzoneButton/DropzoneButton";
import classes from "./Modal.module.css";

interface NewProjectModalProps {
  opened: boolean;
  onClose: () => void;
}

export function CreateNewProjectModal({ opened, onClose}: NewProjectModalProps)  {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleCreate() {
    console.log({
      name,
      description,
    });

    onClose();
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Create New Project"
      centered
      className={classes.title}
    >
      <FloatingLabelInput
        label="Project name"
        placeholder="Enter project name"
        value={name}
        onChange={setName}
        required
      />

      <FloatingLabelInput
        isTextArea
        label="Project description"
        placeholder="Enter project description"
        value={description}
        onChange={setDescription}
      />

      <DropzoneButton />

      <Group justify="flex-end" mt="xl">
        <Button className="error-btn" variant="light" onClick={onClose}>
          Cancel
        </Button>

        <Button className='standard-btn' onClick={handleCreate}>
          Create
        </Button>
      </Group>
    </Modal>
  );
}