import { Outlet, useParams } from 'react-router-dom';
import { StickyBannerHeader } from '../../components/StickyBannerHeader/StickyBannerHeader';
import { useEffect, useState } from 'react';
import { getProjectById } from '../../services/project.service';
import { errorNotification } from '../../services/notification.services';
import type { Project } from '@period-writing-tool/shared';

export default function ProjectLayout() {
  const { projectId } = useParams();
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
    <>
      <StickyBannerHeader currentProject={currentProject} />

      {/* <ProjectSidebar /> */}

      <Outlet />
      {/* <div style={{ height: '600px' }}></div> */}
    </>
  );
}
