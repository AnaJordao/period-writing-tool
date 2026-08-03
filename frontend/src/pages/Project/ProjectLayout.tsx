import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { StickyBannerHeader } from '../../components/StickyBannerHeader/StickyBannerHeader';
import { useEffect, useState } from 'react';
import { getProjectById } from '../../services/project.service';
import { errorNotification } from '../../services/notification.services';
import type { Project } from '@period-writing-tool/shared';
import { AppShell } from '@mantine/core';
import { ProjectSidebar } from '../../components/ProjectSidebar/ProjectSidebar';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBrain,
  IconSettings,
  IconTimeline,
  IconTimelineEventExclamation,
  IconWorld,
  IconWriting,
} from '@tabler/icons-react';
import { ProjectContext } from '../../contexts/ProjectContext';

export default function ProjectLayout() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure();
  const [currentProject, setCurrentProject] = useState<Project>({
    id: '',
    name: '',
    description: '',
    header: '',
    isFavorite: false,
    deletedAt: null,
    createdAt: '',
    updatedAt: '',
  });
  const data = [
    {
      title: 'World Elements',
      icon: IconWorld,
      color: 'blue',
      onClick: () => navigate('/elements'),
    },
    {
      title: 'Writing',
      icon: IconWriting,
      color: 'orange',
      onClick: () => navigate('/writing'),
    },
    {
      title: 'Brainstorm',
      icon: IconBrain,
      color: 'pink',
      onClick: () => navigate('/brainstorm'),
    },
    {
      title: 'Timeline',
      icon: IconTimelineEventExclamation,
      color: 'green',
      onClick: () => navigate('/timeline'),
    },
    {
      title: 'Dashboard',
      icon: IconTimeline,
      color: 'dark',
      onClick: () => navigate('/dashboard'),
    },
    {
      title: 'Settings',
      icon: IconSettings,
      color: 'gray',
      onClick: () => navigate('/settings'),
    },
  ];

  async function fetchProjectById(projectId: string) {
    try {
      const project = await getProjectById(projectId);
      setCurrentProject(project);
    } catch (error) {
      errorNotification(
        'Error',
        error instanceof Error ? error.message : 'An error occurred while fetching the project.',
      );
      console.error('Error fetching project by ID:', error);
    }
  }
  useEffect(() => {
    void fetchProjectById(projectId ?? '');
  }, [projectId]);

  return (
    <ProjectContext
      value={{
        currentProject,
        refreshCurrentProject: () => fetchProjectById(projectId ?? ''),
        dataNavigation: data,
        refreshDataNavigation: () => Promise.resolve(),
      }}
    >
      <AppShell>
        <StickyBannerHeader opened={opened} toggle={toggle} />

        <AppShell.Navbar>
          <ProjectSidebar opened={opened} close={toggle} />
        </AppShell.Navbar>

        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </ProjectContext>
  );
}
