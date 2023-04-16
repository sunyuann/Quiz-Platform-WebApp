import React, { createContext } from 'react';

export const initialValue = {
  token: localStorage.getItem('token'),
};

export const Context = createContext(initialValue);
export const useContext = React.useContext;
