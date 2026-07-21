import { IconDots } from '@tabler/icons-react';
import { ActionIcon, Menu } from '@mantine/core';
import { Fragment } from 'react/jsx-runtime';
import classes from './ThreeDotMenu.module.css';

export interface MenuItem {
  hasMenuLabel?: string;
  menuItemLabel: string;
  menuItemLabelColor: string;
  onClick: () => void;
  hasDivider?: boolean;
  icon: React.ReactNode;
}

interface ThreeDotMenuComponentProps {
  menuItems: MenuItem[];
}

export function ThreeDotMenu({ menuItems }: ThreeDotMenuComponentProps) {
  return (
    <div className={classes.menu}>
      <Menu
        withArrow
        width={200}
        position="bottom"
        transitionProps={{ transition: 'pop' }}
        withinPortal
      >
        <Menu.Target>
          <ActionIcon
            variant="default"
            style={{ color: 'var(--accent)' }}
            aria-label="Open three-dot menu"
          >
            <IconDots size={20} stroke={1.5} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {menuItems.map((prop) => (
            <Fragment key={prop.menuItemLabel}>
              {prop.hasMenuLabel && <Menu.Label>{prop.hasMenuLabel}</Menu.Label>}
              <Menu.Item onClick={prop.onClick} leftSection={prop.icon} c={prop.menuItemLabelColor}>
                {prop.menuItemLabel}
              </Menu.Item>
              {prop.hasDivider && <Menu.Divider />}
            </Fragment>
          ))}
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}
