export interface Project {
  id: string;
  name: string;
  description?: string;
  headerFile?: File | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ProjectRequest {
  name: string;
  description?: string;
  headerFile?: File | null;
}