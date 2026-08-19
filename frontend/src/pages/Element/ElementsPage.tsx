import {
  IconDna2,
  IconLanguage,
  IconMapPin,
  IconStars,
  IconSwords,
  IconUser,
  IconUsersGroup,
} from '@tabler/icons-react';
import { ActionGrid } from '../../components/ActionGrid/ActionsGrid';
import { useNavigate } from 'react-router-dom';

export function ElementsPage() {
  const navigate = useNavigate();

  const elementDataNavigation = [
    {
      sectionName: 'Characters',
      title: 'Characters',
      icon: IconUser,
      color: 'blue',
      onClick: () => navigate('characters'),
    },
    {
      title: 'Groups',
      icon: IconUsersGroup,
      color: 'gray',
      onClick: () => navigate('groups'),
    },
    {
      sectionName: 'Worldbuilding',
      title: 'Locations',
      icon: IconMapPin,
      color: 'green',
      onClick: () => navigate('locations'),
    },
    {
      title: 'Species',
      icon: IconDna2,
      color: 'orange',
      onClick: () => navigate('species'),
    },
    {
      title: 'Items',
      icon: IconSwords,
      color: 'dark',
      onClick: () => navigate('items'),
    },
    {
      title: 'Religions',
      icon: IconStars,
      color: 'yellow',
      onClick: () => navigate('religions'),
    },
    {
      title: 'Languages',
      icon: IconLanguage,
      color: 'pink',
      onClick: () => navigate('languages'),
    },
  ];

  return <ActionGrid title="What do you want to create?" data={elementDataNavigation} />;
}
