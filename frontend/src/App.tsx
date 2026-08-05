import { Container } from '@mantine/core';
import AppRouter from './router/AppRouter';

export default function App() {
  return (
    <Container py="xl">
      <AppRouter />
    </Container>
  );
}
