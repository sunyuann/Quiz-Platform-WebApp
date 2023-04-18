import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ButtonFocus from './components/ButtonFocus';

describe('Test ButtonFocus component', () => {
  it('Button loaded properly and exists', () => {
    render(<ButtonFocus>BUTTONTEXT</ButtonFocus>);
    expect(screen.getByRole('button', { name: /buttontext/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /buttontext/i })).toHaveStyle('outline: 0;');
  });

  it('Button loaded properly and clickable', () => {
    const onClick = jest.fn();
    render(<ButtonFocus onClick={ onClick }>BUTTONTEXT</ButtonFocus>);
    expect(screen.getByRole('button', { name: /buttontext/i })).toBeInTheDocument();
    userEvent.click(screen.getByRole('button'), { name: /buttontext/i });
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
