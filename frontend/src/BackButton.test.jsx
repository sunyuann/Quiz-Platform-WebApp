import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import BackButton from './components/BackButton';

describe('Test BackButton component', () => {
  it('Back button exists and has text back', () => {
    render(
      <Router location={'/'}>
        <BackButton />
      </Router>
    );
    expect(screen.getByRole('button')).toBeInTheDocument()
    const backButton = screen.getByText(/back/i);
    expect(backButton).toBeInTheDocument();
  });

  it('BackButton goes back', () => {
    const history = createMemoryHistory();
    history.push('/page1');
    history.push('/page2');
    render(
      <Router location={history.location} navigator={history}>
        <BackButton />
      </Router>
    );
    const backButton = screen.getByRole('button', { name: /back/i });
    userEvent.click(backButton);
    expect(history.location.pathname).toBe('/page1');
  });
});
