import type { Project, ProjectRequest, ProjectSorting } from '@period-writing-tool/shared';
import { api } from './api';

export async function createProject(data: ProjectRequest) {
  const formData = new FormData();

  formData.append('name', data.name);

  if (data.description) {
    formData.append('description', data.description);
  }

  if (data.header) {
    formData.append('header', data.header);
  }

  const response = await api.post<Project>('/project', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function updateProject(id: string, data: Partial<ProjectRequest>) {
  const formData = new FormData();
  console.log('data: ', data);

  if (data.name) {
    formData.append('name', data.name);
  }

  if (data.description) {
    formData.append('description', data.description);
  }

  if (data.header) {
    formData.append('header', data.header);
  }

  if (data.removeHeader) {
    formData.append('removeHeader', 'true');
  }

  if (data.isFavorite !== undefined) {
    formData.append('isFavorite', data.isFavorite ? 'true' : 'false');
  }

  const response = await api.patch<Project>(`/project/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function getProjects(
  { sortBy, order }: ProjectSorting,
  isOnlyFavoriteFilter: boolean,
  isOnlyDeletedFilter: boolean,
): Promise<Project[]> {
  const response = await api.get<Project[]>('/project', {
    params: {
      sortBy,
      order,
      isOnlyFavoriteFilter,
      isOnlyDeletedFilter,
    },
  });
  return response.data;
}

export async function getProjectById(id: string) {
  const response = await api.get<Project>(`/project/${id}`);
  return response.data;
}

export async function deleteProject(id: string) {
  await api.delete<Project>(`/project/${id}`);
}

export async function deleteProjectPermanently(id: string) {
  await api.delete<Project>(`/project/${id}/permanent`);
}

export async function restoreProject(id: string) {
  const response = await api.patch<Project>(`/project/${id}/restore`);
  return response.data;
}
