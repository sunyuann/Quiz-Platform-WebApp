import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import AnswerBoxes from './components/AnswerBoxes';

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
