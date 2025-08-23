import '@testing-library/jest-dom';

// Mock IndexedDB for tests
const mockIDB = {
  open: jest.fn(),
  deleteDB: jest.fn(),
  wrap: jest.fn(),
  unwrap: jest.fn(),
};

Object.defineProperty(window, 'indexedDB', {
  value: mockIDB,
  writable: true,
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));