export interface Project {
  id: string;
  name: string;
  description?: string;
  header?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ProjectRequest {
  id?: string;
  name: string;
  description?: string;
  header?: File | null;
  currentHeader?: string | null;
  removeHeader?: boolean;
}
