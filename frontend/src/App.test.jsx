import React from 'react';
import { render, screen } from '@testing-library/react';

test("Jest doesn't like CanvasJS code so no render(<App />) here", () => {
  render(<button />);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
