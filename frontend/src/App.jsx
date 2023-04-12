import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import { Context, initialValue } from './context';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Page404 from './pages/Page404'
import Register from './pages/Register';
import NavBar from './components/NavBar';
import QuizEdit from './pages/QuizEdit';
import QuestionEdit from './pages/QuestionEdit';

function App () {
  const [token, setToken] = React.useState(initialValue.token);
  const setManagedToken = (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    setToken(token);
  }
  const getters = {
    token,
  };
  const setters = {
    setManagedToken,
  }

  return (
    <>
      <Context.Provider value={{ getters, setters, }}>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/quiz/edit/:id" element={<QuizEdit />} />
            <Route path="/quiz/edit/:id/:questionId" element={<QuestionEdit />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </BrowserRouter>
      </Context.Provider>
    </>
  );
}

export default App;
