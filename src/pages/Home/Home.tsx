import { useDisclosure } from '@mantine/hooks';
import { HeaderSearch } from '../../components/HeaderSearch/HeaderSearch';
import { ProjectModal } from '../../components/ProjectModal/ProjectModal';
import { getProjects } from '../../services/project.service';
import { useEffect, useState } from 'react';
import type { Project, ProjectRequest } from '../../../shared/types/Project/Project';
import { CardComponent } from '../../components/CardComponent/CardComponent';
import { SimpleGrid } from '@mantine/core';
import { errorNotification } from '../../services/notification.services';

export default function Home() {
  const [opened, { open, close }] = useDisclosure(false);
  const [projectRequest, setProjectRequest] = useState<ProjectRequest>({
    name: '',
    description: '',
    header: null,
    currentHeader: null,
    removeHeader: false,
  });
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  function onCleanForm() {
    setProjectRequest({
      name: '',
      description: '',
      header: null,
      currentHeader: null,
      removeHeader: false,
    });
  }

  function openCreateModal() {
    onCleanForm();
    setIsUpdateMode(false);
    open();
  }

  function openEditModal(project: Project) {
    setProjectRequest({
      id: project.id,
      name: project.name,
      description: project.description ?? '',
      header: null,
      currentHeader: project.header,
      removeHeader: false,
    });

    setIsUpdateMode(true);
    open();
  }

  async function fetchProjects() {
    try {
      const projects = await getProjects();
      setAllProjects(projects);
    } catch (error) {
      errorNotification(
        'Error',
        error instanceof Error ? error.message : 'An error occurred while fetching the projects.',
      );
      console.error(error);
    }
  }
  useEffect(() => {
    void fetchProjects();
  }, []);

  return (
    <>
      <HeaderSearch onClickBtn={openCreateModal} />

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {allProjects.map((project) => (
          <CardComponent
            key={project.id}
            {...project}
            menuItens={[
              {
                menuItemLabel: 'Edit project',
                onClick: () => {
                  openEditModal(project);
                },
                hasDivider: false,
              },
            ]}
          />
        ))}
      </SimpleGrid>

      <ProjectModal
        opened={opened}
        onClose={close}
        onClean={onCleanForm}
        projectRequest={projectRequest}
        setProjectRequest={setProjectRequest}
        isUpdateMode={isUpdateMode}
        onSave={() => {
          void fetchProjects();
        }}
      />
    </>
  );
}
