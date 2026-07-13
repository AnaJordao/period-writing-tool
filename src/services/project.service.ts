import type { Project, ProjectRequest } from "../../shared/types/Project/Project";
import { api } from "./api";

export async function createProject(data: ProjectRequest) {
  const formData = new FormData();

  formData.append("name", data.name);

  if (data.description) {
    formData.append("description", data.description);
  }

  if (data.header) {
    formData.append("header", data.header);
  }

  const response = await api.post<Project>(
    "/project",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}

export async function getProjects() {
  const response = await api.get<Project[]>("/project");
  return response.data;
}

export async function getProjectById(id: string) {
  const response = await api.get<Project>(`/project/${id}`);
  return response.data;
}

export async function updateProject(
  id: string,
  data: Partial<ProjectRequest>
) {
  const response = await api.patch<Project>(`/project/${id}`, data);
  return response.data;
}

export async function deleteProject(id: string) {
  await api.delete<Project>(`/project/${id}`);
}