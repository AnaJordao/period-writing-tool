import { useNavigate } from 'react-router-dom';
import { ActionGrid } from '../../components/ActionGrid/ActionsGrid';
import {
  IconBrain,
  IconSettings,
  IconTimeline,
  IconTimelineEventExclamation,
  IconWorld,
  IconWriting,
} from '@tabler/icons-react';

export function ProjectInterface() {
  const navigate = useNavigate();

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

  return <ActionGrid data={data} title="What would you like to do?"></ActionGrid>;
}
