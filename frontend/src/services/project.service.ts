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

  const response = await api.patch<Project>(`/project/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function getProjects({ sortBy, order }: ProjectSorting) {
  const response = await api.get<Project[]>('/project', {
    params: {
      sortBy,
      order,
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
