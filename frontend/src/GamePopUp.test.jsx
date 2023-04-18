import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GamePopup from './components/GamePopup';

describe('Test GamePopup component', () => {
  it('GamePopup exists', () => {
    render(<GamePopup title='testTitle' description='testDescription' yesText='testYesText' />);
    screen.logTestingPlaygroundURL();
    expect(screen.getByRole('heading', { name: /testtitle/i })).toBeInTheDocument();
    expect(screen.getByText(/testdescription/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /testyestext/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });
  it('GamePopup handleYes button works', () => {
    const handleYes = jest.fn();
    render(<GamePopup title='testTitle' description='testDescription' yesText='testYesText' handleYes={handleYes}/>);
    userEvent.click(screen.getByRole('button', { name: /testyestext/i }));
    expect(handleYes).toHaveBeenCalledTimes(1);
  });
  it('GamePopup handleClose button works', () => {
    const handleClose = jest.fn();
    render(<GamePopup title='testTitle' description='testDescription' yesText='testYesText' handleClose={handleClose}/>);
    userEvent.click(screen.getByRole('button', { name: /Close/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
})
