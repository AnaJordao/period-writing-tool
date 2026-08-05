import { ActionGrid } from '../../components/ActionGrid/ActionsGrid';
import { useProject } from '../../contexts/ProjectContext';

export function ProjectInterface() {
  const { dataNavigation } = useProject();
  return <ActionGrid data={dataNavigation} title="Where would you like to go?"></ActionGrid>;
}
