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
import Play from './pages/Play';
import Register from './pages/Register';
import NavBar from './components/NavBar';
import QuestionEdit from './pages/QuestionEdit';
import QuizControl from './pages/QuizControl';
import QuizEdit from './pages/QuizEdit';

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
            <Route path="/play" element={<Play />} />
            <Route path="/play/:sessionID" element={<Play />} />
            <Route path="/quiz/control/:quizID/:sessionID" element={<QuizControl />} />
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
