import { useEffect, useMemo, useRef } from 'react';
import { IconCloudUpload, IconDownload, IconX } from '@tabler/icons-react';
import { Button, Group, Image, Text, useMantineTheme, ActionIcon } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import classes from './DropzoneButton.module.css';

interface DropzoneButtonProps {
  headerFile: File | null;
  setHeaderFile: (file: File | null) => void;
}

export function DropzoneButton({
  headerFile,
  setHeaderFile,
}: DropzoneButtonProps) {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);

  const preview = useMemo(() => {
    if (!headerFile) {
      return null;
    }

    return URL.createObjectURL(headerFile);
  }, [headerFile]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className={classes.wrapper}>
      <Dropzone
        openRef={openRef}
        onDrop={(files) => {
          if (files.length > 0) {
            setHeaderFile(files[0]);
          }
        }}
        className={classes.dropzone}
        radius="md"
        accept={[MIME_TYPES.jpeg, MIME_TYPES.png, MIME_TYPES.svg, MIME_TYPES.webp]}
        maxSize={30 * 1024 ** 2}
        aria-label="Drop files here"
      >
        <div>
          <Group justify="center">
            <Dropzone.Accept>
              <IconDownload size={50} color={theme.colors.blue[6]} stroke={1.5} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={50} color={theme.colors.red[6]} stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconCloudUpload size={50} stroke={1.5} className={classes.icon} />
            </Dropzone.Idle>
          </Group>

          <Text ta="center" fw={700} fz="lg" mt="xl">
            <Dropzone.Accept>Drop files here</Dropzone.Accept>
            <Dropzone.Reject>Image file less than 30mb</Dropzone.Reject>
            <Dropzone.Idle>Upload a cover </Dropzone.Idle>
          </Text>

          <Text className={classes.description}>
            Drag&apos;n&apos;drop a file here to upload. We can accept only <i>.jpeg</i>, <i>.png</i>, <i>.svg</i>, and <i>.webp</i> files that
            are less than 30mb in size.
          </Text>
          
        </div>
      </Dropzone>
      {headerFile && preview && (
        <div className={classes.previewContainer}>
          <ActionIcon
            className={classes.removeButton}
            color="red"
            variant="filled"
            radius="xl"
            onClick={() => {
                setHeaderFile(null);
              }}
            aria-label="Remove image"
          >
            <IconX size={16} />
          </ActionIcon>

          <Image
            src={preview}
            h={180}
            radius="md"
            fit="cover"
          />
        </div>
      )}


      <Button className={classes.control} color="violet" size="md" radius="xl" onClick={() => openRef.current?.()}>
        Select files
      </Button>
    </div>
  );
}