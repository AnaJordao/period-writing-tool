import { Spinner } from '@gfazioli/mantine-spinner';
import { Center } from '@mantine/core';
import '@gfazioli/mantine-spinner/styles.css';

export function SpinnerComponent() {
  return (
    <Center>
      <Spinner
        size={80}
        segments={16}
        thickness={4}
        inner={24}
        gradient={{ from: 'grape', to: 'violet' }}
        variant="trail"
        duration={800}
      />
    </Center>
  );
}
