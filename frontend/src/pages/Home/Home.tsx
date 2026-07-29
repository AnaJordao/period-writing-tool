import { useDisclosure } from '@mantine/hooks';
import { HeaderSearch } from '../../components/HeaderSearch/HeaderSearch';
import { ProjectModal } from '../../components/ProjectModal/ProjectModal';
import { getProjects, restoreProject, updateProject } from '../../services/project.service';
import { useEffect, useMemo, useState } from 'react';
import type { Project, ProjectRequest, ProjectSorting } from '@period-writing-tool/shared';
import { CardComponent } from '../../components/CardComponent/CardComponent';
import { Group, SimpleGrid } from '@mantine/core';
import { errorNotification } from '../../services/notification.services';
import { DeleteModal } from '../../components/DeleteModal/DeleteModal';
import { IconEdit, IconHeart, IconTrash } from '@tabler/icons-react';
import { GradientSegmentedControl } from '../../components/GradientSegmentedControl/GradientSegmentedControl';
import { SwitchComponent } from '../../components/SwitchComponent/SwitchComponent';

export default function Home() {
  const [search, setSearch] = useState('');
  const [openedProjectModal, { open: openProjectModal, close: closeProjectModal }] =
    useDisclosure(false);
  const [openedDeleteModal, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);
  const [projectRequest, setProjectRequest] = useState<ProjectRequest>({
    name: '',
    description: '',
    header: null,
    currentHeader: null,
    removeHeader: false,
  });
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [isOnlyFavorites, setIsOnlyFavorites] = useState(false);
  const [isOnlyDeleted, setIsOnlyDeleted] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [projectSorting, setProjectSorting] = useState<ProjectSorting>({
    sortBy: 'updatedAt',
    order: 'desc',
  });

  const filteredProjects: Project[] = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return allProjects;
    }

    return allProjects.filter((project) => {
      const name = project.name.toLowerCase();
      const description = (project.description ?? '').toLowerCase();

      return (
        (name.includes(query) || description.includes(query)) &&
        (isOnlyFavorites ? project.isFavorite : true) &&
        (isOnlyDeleted ? project.deletedAt !== null : true)
      );
    });
  }, [allProjects, search, isOnlyFavorites, isOnlyDeleted]);

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

  function openDeleteProjectModal(projectId: string, isPermanentDelete = false) {
    setProjectRequest({
      id: projectId,
      name: '',
      description: '',
      header: null,
      currentHeader: null,
      removeHeader: false,
    });
    setIsPermanentDelete(isPermanentDelete);
    openDeleteModal();
  }

  async function fetchProjects() {
    try {
      const projects = await getProjects(projectSorting, isOnlyFavorites, isOnlyDeleted);
      setAllProjects(projects);
    } catch (error) {
      errorNotification(
        'Error',
        error instanceof Error ? error.message : 'An error occurred while fetching the projects.',
      );
      console.error(error);
    }
  }

  async function handleFavoriteClick(project: Project) {
    await updateProject(project.id, {
      name: project.name,
      isFavorite: !project.isFavorite,
    });

    void fetchProjects();
  }

  async function handleRestoreClick(project: Project) {
    await restoreProject(project.id);
    void fetchProjects();
  }

  useEffect(() => {
    void fetchProjects();
  }, [projectSorting, isOnlyFavorites, isOnlyDeleted]);

  return (
    <>
      <HeaderSearch onClickBtn={openCreateModal} search={search} onSearchChange={setSearch} />

      <Group mt="md" mb="md">
        <GradientSegmentedControl
          label="Sort by:"
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
          label="Order:"
          data={orderOptions}
          value={projectSorting.order}
          onChange={(value) => {
            setProjectSorting({
              ...projectSorting,
              order: value as ProjectSorting['order'],
            });
          }}
        />

        <SwitchComponent
          label={<IconHeart size={22} stroke={1.5} style={{ color: 'var(--accent)' }} />}
          ariaLabel="Only favorite projects"
          onChange={() => {
            setIsOnlyFavorites(!isOnlyFavorites);
          }}
        />

        <SwitchComponent
          label={<IconTrash size={22} stroke={1.5} style={{ color: 'var(--accent)' }} />}
          ariaLabel="Only deleted projects"
          onChange={() => {
            setIsOnlyDeleted(!isOnlyDeleted);
          }}
        />
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {filteredProjects.map((project: Project) => {
          return (
            <CardComponent
              key={project.id}
              {...project}
              isDeleted={project.deletedAt !== null && project.deletedAt !== undefined}
              search={search}
              handleFavoriteClick={() => {
                void handleFavoriteClick(project);
              }}
              handleRestoreClick={() => {
                void handleRestoreClick(project);
              }}
              handleEditClick={() => {
                openEditModal(project);
              }}
              menuItems={
                project.deletedAt !== null && project.deletedAt !== undefined
                  ? [
                      {
                        menuItemLabel: 'Delete permanently',
                        menuItemLabelColor: 'var(--error-bg)',
                        onClick: () => {
                          openDeleteProjectModal(project.id, true);
                        },
                        hasDivider: false,
                        icon: (
                          <IconTrash size={16} stroke={1.5} style={{ color: 'var(--error-bg)' }} />
                        ),
                      },
                    ]
                  : [
                      {
                        menuItemLabel: 'Edit project',
                        menuItemLabelColor: 'var(--accent)',
                        onClick: () => {
                          openEditModal(project);
                        },
                        hasDivider: false,
                        icon: (
                          <IconEdit size={16} stroke={1.5} style={{ color: 'var(--accent)' }} />
                        ),
                      },
                      {
                        menuItemLabel: 'Delete project',
                        menuItemLabelColor: 'var(--error-bg)',
                        onClick: () => {
                          openDeleteProjectModal(project.id);
                        },
                        hasDivider: false,
                        icon: (
                          <IconTrash size={16} stroke={1.5} style={{ color: 'var(--error-bg)' }} />
                        ),
                      },
                    ]
              }
            />
          );
        })}
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
        isPermanentDelete={isPermanentDelete}
        onClose={closeDeleteModal}
        onDelete={() => {
          void fetchProjects();
        }}
      />
    </>
  );
}
