import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnswerBox from './components/AnswerBox';

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
