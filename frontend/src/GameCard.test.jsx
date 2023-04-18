import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameCard from './components/GameCard';

describe('Test GameCard component', () => {
  it('GameCard shows Start, Edit, Delete buttons when inactive', () => {
    const quiz = {
      active: false,
      questions: [],
      name: 'ello dere',
      thumbnail: 'why',
    }
    render(<GameCard quiz={quiz} />);
    expect(screen.getAllByRole('button').length).toBe(4);
    expect(screen.getByText(/start/i)).toBeInTheDocument();
    expect(screen.getByText(/edit/i)).toBeInTheDocument();
    expect(screen.getByText(/import json/i)).toBeInTheDocument();
    expect(screen.getByText(/delete/i)).toBeInTheDocument();
    expect(screen.queryByText(/Stop/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Control Panel/i)).not.toBeInTheDocument();
  });

  it('GameCard shows Stop, Control Panel buttons when active', () => {
    const quiz = {
      active: true,
      questions: [],
      name: 'ello dere',
      thumbnail: 'why',
    }
    render(<GameCard quiz={quiz} />);
    expect(screen.getAllByRole('button').length).toBe(2);
    expect(screen.queryByText(/start/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/edit/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/import json/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/delete/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Stop/i)).toBeInTheDocument();
    expect(screen.getByText(/Control Panel/i)).toBeInTheDocument();
  });

  it('GameCard Start, Edit, Delete buttons correct onClick', () => {
    const quiz = {
      active: false,
      questions: [],
      name: 'ello dere',
      thumbnail: 'why',
    }
    const handleStart = jest.fn();
    const handleEdit = jest.fn();
    const handleDelete = jest.fn();
    const handleStop = jest.fn();
    const handleControl = jest.fn();
    render(
    <GameCard
      quiz={quiz}
      handleStart={handleStart}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      handleStop={handleStop}
      handleControl={handleControl}
    />);
    userEvent.click(screen.getByText(/start/i));
    expect(handleStart).toHaveBeenCalledTimes(1);
    userEvent.click(screen.getByText(/edit/i));
    expect(handleEdit).toHaveBeenCalledTimes(1);
    userEvent.click(screen.getByText(/delete/i));
    expect(handleDelete).toHaveBeenCalledTimes(1);
    expect(handleStop).toHaveBeenCalledTimes(0);
    expect(handleControl).toHaveBeenCalledTimes(0);
  });

  it('GameCard Stop, Control Panel buttons correct onClick', () => {
    const quiz = {
      active: true,
      questions: [],
      name: 'ello dere',
      thumbnail: 'why',
    }
    const handleStart = jest.fn();
    const handleEdit = jest.fn();
    const handleDelete = jest.fn();
    const handleStop = jest.fn();
    const handleControl = jest.fn();
    render(
    <GameCard
      quiz={quiz}
      handleStart={handleStart}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      handleStop={handleStop}
      handleControl={handleControl}
    />);
    userEvent.click(screen.getByText(/stop/i));
    expect(handleStop).toHaveBeenCalledTimes(1);
    userEvent.click(screen.getByText(/control panel/i));
    expect(handleControl).toHaveBeenCalledTimes(1);
    expect(handleStart).toHaveBeenCalledTimes(0);
    expect(handleEdit).toHaveBeenCalledTimes(0);
    expect(handleDelete).toHaveBeenCalledTimes(0);
  });
});
