export interface Project {
  id: string;
  name: string;
  description?: string;
  header?: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ProjectRequest {
  id?: string;
  name: string;
  description?: string;
  header?: File | null;
  isFavorite?: boolean;
  currentHeader?: string | null;
  removeHeader?: boolean;
}

export interface ProjectSorting {
  sortBy: "name" | "createdAt" | "updatedAt";
  order: "asc" | "desc";
}
