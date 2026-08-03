import type { Project } from '@period-writing-tool/shared';
import type { IconProps } from '@tabler/icons-react';
import { use, createContext } from 'react';

interface dataNavigation {
  title: string;
  icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;
  color: string;
  onClick: () => void;
}

interface ProjectContextType {
  currentProject: Project;
  refreshCurrentProject: () => Promise<void>;
  dataNavigation: dataNavigation[];
  refreshDataNavigation: () => Promise<void>;
}

export const ProjectContext = createContext<ProjectContextType | null>(null);

export function useProject() {
  const context = use<ProjectContextType | null>(ProjectContext);

  if (!context) {
    throw new Error('useProject must be used inside ProjectProvider');
  }

  return context;
}
