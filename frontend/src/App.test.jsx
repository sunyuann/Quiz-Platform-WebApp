import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import AnswerBox from './components/AnswerBox';
import AnswerBoxes from './components/AnswerBoxes';
import BackButton from './components/BackButton';

describe('Test AnswerBox component', () => {
  it('AnswerBox exists', () => {
    render(<AnswerBox answer='fsrafgerw' />);
    expect(screen.getByText('fsrafgerw')).toBeInTheDocument();
  });
  it('AnswerBox onClick works', () => {
    const onClick = jest.fn();
    render(<AnswerBox answer='fsrafgerw' onClick={onClick}/>);
    userEvent.click(screen.getByText('fsrafgerw'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  it('AnswerBox onClick does not run when disabled', () => {
    const onClick = jest.fn();
    render(<AnswerBox answer='fsrafgerw' disabled={true} onClick={onClick}/>);
    userEvent.click(screen.getByText('fsrafgerw'));
    expect(onClick).toHaveBeenCalledTimes(0);
  });
})

describe('Test AnswerBoxes component', () => {
  it('0 AnswerBoxes exists with answers.length === 0', () => {
    render(<AnswerBoxes answers={[]} />);
    expect(screen.queryByText('fsrafgerw')).not.toBeInTheDocument();
  });
  // Sanity check, in case cleanup() fails
  it('2 AnswerBoxes exists with answers.length 2', () => {
    const answers = new Array(2).fill('fsrafgerw');
    render(<AnswerBoxes answers={answers} />);
    expect(screen.getAllByText('fsrafgerw').length).toBe(2);
  });
  it('1-6 AnswerBoxes exists with answers.length 1-6', () => {
    for (let i = 1; i < 7; i++) {
      const answers = new Array(i).fill('fsrafgerw');
      render(<AnswerBoxes answers={answers} />);
      expect(screen.getAllByText('fsrafgerw').length).toBe(i);
      cleanup();
    }
  });
  it('3 AnswerBoxes regardless of corrects.length, wrongs.length or disabled.length', () => {
    const answers = new Array(3).fill('fsrafgerw');
    const other = new Array(6).fill(true);
    render(<AnswerBoxes answers={answers} corrects={other} wrongs={other} disabled={other} />);
    expect(screen.getAllByText('fsrafgerw').length).toBe(3);
  });
})

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
