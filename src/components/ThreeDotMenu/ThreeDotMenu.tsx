import { IconDots, IconEdit } from '@tabler/icons-react';
import { ActionIcon, Menu } from '@mantine/core';
import { Fragment } from 'react/jsx-runtime';
import classes from './ThreeDotMenu.module.css';

export interface MenuItem {
  hasMenuLabel?: string;
  menuItemLabel: string;
  onClick: () => void;
  hasDivider?: boolean;
}

interface ThreeDotMenuComponentProps {
  menuItens?: MenuItem[];
}

export function ThreeDotMenu({ menuItens = [] }: ThreeDotMenuComponentProps) {
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
          <ActionIcon variant="default" style={{ color: 'var(--accent)' }}>
            <IconDots size={20} stroke={1.5} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {menuItens.map((prop, index) => (
            <Fragment key={index}>
              {prop.hasMenuLabel && <Menu.Label>{prop.hasMenuLabel}</Menu.Label>}
              <Menu.Item
                onClick={prop.onClick}
                leftSection={<IconEdit size={16} stroke={1.5} style={{ color: 'var(--accent)' }} />}
              >
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
