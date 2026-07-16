import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

globalThis.ResizeObserver = class {
  observe() {
    // mock
  }

  unobserve() {
    // mock
  }

  disconnect() {
    // mock
  }
};

globalThis.IntersectionObserver = class {
  observe() {
    // mock
  }
  unobserve() {
    // mock
  }
  disconnect() {
    // mock
  }
} as unknown as typeof IntersectionObserver;

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(() => false),
  }),
});
