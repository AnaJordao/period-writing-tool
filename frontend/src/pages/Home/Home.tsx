import { useDisclosure } from '@mantine/hooks';
import { HeaderSearch } from '../../components/HeaderSearch/HeaderSearch';
import { ProjectModal } from '../../components/ProjectModal/ProjectModal';
import { getProjects } from '../../services/project.service';
import { useEffect, useMemo, useState } from 'react';
import type { Project, ProjectRequest, ProjectSorting } from '@period-writing-tool/shared';
import { CardComponent } from '../../components/CardComponent/CardComponent';
import { Group, SimpleGrid } from '@mantine/core';
import { errorNotification } from '../../services/notification.services';
import { DeleteModal } from '../../components/DeleteModal/DeleteModal';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { GradientSegmentedControl } from '../../components/GradientSegmentedControl/GradientSegmentedControl';

export default function Home() {
  const [search, setSearch] = useState('');
  const [openedProjectModal, { open: openProjectModal, close: closeProjectModal }] =
    useDisclosure(false);
  const [openedDeleteModal, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);
  const [projectRequest, setProjectRequest] = useState<ProjectRequest>({
    name: '',
    description: '',
    header: null,
    currentHeader: null,
    removeHeader: false,
  });
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [projectSorting, setProjectSorting] = useState<ProjectSorting>({
    sortBy: 'updatedAt',
    order: 'desc',
  });

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return allProjects;
    }

    return allProjects.filter((project) => {
      const name = project.name.toLowerCase();
      const description = (project.description ?? '').toLowerCase();

      return name.includes(query) || description.includes(query);
    });
  }, [allProjects, search]);

  const sortByOptions = [
    { value: 'name', label: 'Name' },
    { value: 'createdAt', label: 'Date of creation' },
    { value: 'updatedAt', label: 'Date of modification' },
  ] as { value: ProjectSorting['sortBy']; label: string }[];

  const orderOptions = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
  ] as { value: ProjectSorting['order']; label: string }[];

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
    openProjectModal();
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
    openProjectModal();
  }

  function openDeleteProjectModal(projectId: string) {
    setProjectRequest({
      id: projectId,
      name: '',
      description: '',
      header: null,
      currentHeader: null,
      removeHeader: false,
    });
    openDeleteModal();
  }

  async function fetchProjects() {
    try {
      const projects = await getProjects(projectSorting);
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
      <HeaderSearch onClickBtn={openCreateModal} search={search} onSearchChange={setSearch} />

      <Group mt="md" mb="md">
        <GradientSegmentedControl
          label="Sort by"
          data={sortByOptions}
          value={projectSorting.sortBy}
          onChange={(value) => {
            setProjectSorting({
              ...projectSorting,
              sortBy: value as ProjectSorting['sortBy'],
            });
          }}
        />

        <GradientSegmentedControl
          label="Order"
          data={orderOptions}
          value={projectSorting.order}
          onChange={(value) => {
            setProjectSorting({
              ...projectSorting,
              order: value as ProjectSorting['order'],
            });
          }}
        />
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {filteredProjects.map((project) => (
          <CardComponent
            key={project.id}
            {...project}
            search={search}
            menuItems={[
              {
                menuItemLabel: 'Edit project',
                menuItemLabelColor: 'var(--accent)',
                onClick: () => {
                  openEditModal(project);
                },
                hasDivider: false,
                icon: <IconEdit size={16} stroke={1.5} style={{ color: 'var(--accent)' }} />,
              },
              {
                menuItemLabel: 'Delete project',
                menuItemLabelColor: 'var(--error-bg)',
                onClick: () => {
                  openDeleteProjectModal(project.id);
                },
                hasDivider: false,
                icon: <IconTrash size={16} stroke={1.5} style={{ color: 'var(--error-bg)' }} />,
              },
            ]}
          />
        ))}
      </SimpleGrid>

      <ProjectModal
        opened={openedProjectModal}
        onClose={closeProjectModal}
        onClean={onCleanForm}
        projectRequest={projectRequest}
        setProjectRequest={setProjectRequest}
        isUpdateMode={isUpdateMode}
        onSave={() => {
          void fetchProjects();
        }}
      />

      <DeleteModal
        opened={openedDeleteModal}
        projectRequest={projectRequest}
        onClose={closeDeleteModal}
        onDelete={() => {
          void fetchProjects();
        }}
      />
    </>
  );
}
