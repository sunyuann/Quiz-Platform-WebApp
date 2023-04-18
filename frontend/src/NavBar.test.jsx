import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Context } from './context';
import { createMemoryHistory } from 'history';
import NavBar from './components/NavBar';
import * as helpers from './helpers';

describe('Test NavBar component', () => {
  const originalContext = React.createContext;
  const mockSetters = {
    setManagedToken: jest.fn()
  };
  afterEach(() => {
    React.createContext = originalContext;
  });

  it('NavBar no token shows sign up, sign in, join a game', () => {
    React.createContext = () => ({
      getters: { token: null },
      setters: mockSetters
    });
    render(
      <BrowserRouter location={'/'}>
        <Context.Provider value={React.createContext()}>
          <NavBar />
        </Context.Provider>
      </BrowserRouter>
    );
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/join a game/i)).toBeInTheDocument();
    expect(screen.queryByText(/dashboard/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();
  });

  it('NavBar token shows dashboard, join a game, logout', () => {
    React.createContext = () => ({
      getters: { token: 'fgnrklvfemwkalcvmszdkf' },
      setters: mockSetters
    });
    render(
      <BrowserRouter location={'/'}>
        <Context.Provider value={React.createContext()}>
          <NavBar />
        </Context.Provider>
      </BrowserRouter>
    );
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/join a game/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
    expect(screen.queryByText(/sign up/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sign in/i)).not.toBeInTheDocument();
  });

  it('NavBar token logout works', async () => {
    // eslint-disable-next-line no-import-assign
    helpers.apiCall = jest.fn();
    helpers.apiCall.mockResolvedValue({});
    const history = createMemoryHistory();
    history.push('/dashboard');
    React.createContext = () => ({
      getters: { token: 'fgnrklvfemwkalcvmszdkf' },
      setters: mockSetters
    });
    render(
      <BrowserRouter location={history.location} navigator={history}>
        <Context.Provider value={React.createContext()}>
          <NavBar />
        </Context.Provider>
      </BrowserRouter>
    );
    userEvent.click(screen.getByText(/logout/i));
    await waitFor(() => expect(mockSetters.setManagedToken).toHaveBeenCalledTimes(1));
  });
});
