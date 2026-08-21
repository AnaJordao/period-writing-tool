import {
  IconDna2,
  IconLanguage,
  IconMapPin,
  IconStars,
  IconSwords,
  IconUser,
  IconUsersGroup,
} from '@tabler/icons-react';
import { ActionGrid, type ActionGridSectionProps } from '../../components/ActionGrid/ActionsGrid';
import { useNavigate } from 'react-router-dom';

export function ElementsPage() {
  const navigate = useNavigate();

  const elementDataNavigation: ActionGridSectionProps[] = [
    {
      sectionName: 'Characters',
      sectionData: [
        {
          title: 'Characters',
          icon: IconUser,
          color: 'blue',
          onClick: () => void navigate('characters'),
        },
        {
          title: 'Groups',
          icon: IconUsersGroup,
          color: 'gray',
          onClick: () => void navigate('groups'),
        },
      ],
    },
    {
      sectionName: 'Worldbuilding',
      sectionData: [
        {
          title: 'Locations',
          icon: IconMapPin,
          color: 'green',
          onClick: () => void navigate('locations'),
        },
        {
          title: 'Species',
          icon: IconDna2,
          color: 'orange',
          onClick: () => void navigate('species'),
        },
        {
          title: 'Items',
          icon: IconSwords,
          color: 'dark',
          onClick: () => void navigate('items'),
        },
        {
          title: 'Religions',
          icon: IconStars,
          color: 'yellow',
          onClick: () => void navigate('religions'),
        },
        {
          title: 'Languages',
          icon: IconLanguage,
          color: 'pink',
          onClick: () => void navigate('languages'),
        },
      ],
    },
  ];

  return (
    <ActionGrid title="What do you want to create?" type="sectioned" data={elementDataNavigation} />
  );
}
