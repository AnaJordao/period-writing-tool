import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import './index.css';
import App from './App';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { BrowserRouter } from 'react-router-dom';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(
  <StrictMode>
    <MantineProvider>
      <BrowserRouter>
        <Notifications position="top-right" />
        <App />
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>,
);
