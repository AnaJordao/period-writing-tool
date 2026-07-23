import { render as rtlRender, type RenderOptions } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { ReactElement, ReactNode } from 'react';

export function render(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return rtlRender(ui, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <MantineProvider>
        <Notifications />
        {children}
      </MantineProvider>
    ),
    ...options,
  });
}
