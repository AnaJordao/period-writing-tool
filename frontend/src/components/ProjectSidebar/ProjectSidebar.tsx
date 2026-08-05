import { Drawer, UnstyledButton, useMantineTheme } from '@mantine/core';
import classes from './ProjectSidebar.module.css';
import { useProject } from '../../contexts/ProjectContext';

export function ProjectSidebar({ opened, close }: { opened: boolean; close: () => void }) {
  const { dataNavigation } = useProject();
  const theme = useMantineTheme();
  return (
    <Drawer
      opened={opened}
      onClose={close}
      size="25%"
      padding="md"
      title="Where would you like to go?"
      zIndex={1000000}
      classNames={{ body: classes.drawerBody }}
      closeButtonProps={{
        'aria-label': 'Close sidebar',
      }}
    >
      {dataNavigation.map((item, index) => (
        // eslint-disable-next-line react-x/no-array-index-key, @typescript-eslint/restrict-template-expressions
        <UnstyledButton key={`project-sidebar-btn-${index}`} onClick={item.onClick}>
          <item.icon
            color={theme.colors[item.color][6]}
            size={25}
            stroke={1.5}
            style={{ marginRight: 10 }}
          />
          {item.title}
        </UnstyledButton>
      ))}
    </Drawer>
  );
}
