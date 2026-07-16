import { IconPlus, IconSearch } from '@tabler/icons-react';
import {
  Burger,
  Button,
  Divider,
  Drawer,
  Group,
  ScrollArea,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './HeaderSearch.module.css';

interface HeaderSearchProps {
  onClickBtn: () => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export function HeaderSearch({ onClickBtn, search, onSearchChange }: HeaderSearchProps) {
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Group>
          <Burger
            opened={opened}
            onClick={toggle}
            size="sm"
            hiddenFrom="sm"
            aria-label="Toggle navigation"
          />
          <Title order={3} className={classes.title}>
            Period - Writing Tool
          </Title>
          {/* <MantineLogo size={28} /> */}
        </Group>

        <Group>
          <TextInput
            value={search}
            onChange={(event) => {
              onSearchChange(event.currentTarget.value);
            }}
            classNames={{ input: classes.search }}
            placeholder="Search"
            leftSection={<IconSearch className={classes.icon} size={16} stroke={1.5} />}
            visibleFrom="xs"
          />
          <Button className="standard-btn" visibleFrom="sm" onClick={onClickBtn}>
            <IconPlus size={16} />
            New Project
          </Button>
        </Group>
      </div>

      <Drawer
        opened={opened}
        onClose={close}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px)" mx="-md">
          <Divider className={classes.divider} my="sm" />
          <Button className="standard-btn" mx="md" mb="sm" onClick={onClickBtn}>
            <IconPlus size={16} />
            New Project
          </Button>
          <TextInput
            value={search}
            onChange={(event) => {
              onSearchChange(event.currentTarget.value);
            }}
            classNames={{ input: classes.search }}
            placeholder="Search"
            leftSection={<IconSearch className={classes.icon} size={16} stroke={1.5} />}
            mx="md"
            mb="sm"
          />
        </ScrollArea>
      </Drawer>
    </header>
  );
}
