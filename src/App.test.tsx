import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Dropcito title', () => {
  render(<App />);
  const titleElement = screen.getByText('Dropcito', { selector: '.nav-brand span' });
  expect(titleElement).toBeInTheDocument();
});
