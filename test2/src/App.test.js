import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/舆情情感实时监测系统/i);
  expect(titleElement).toBeInTheDocument();
});
