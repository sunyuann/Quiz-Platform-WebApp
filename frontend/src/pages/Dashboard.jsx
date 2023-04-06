import React from 'react';
import Button from '@mui/material/Button';
import NavBar from '../components/NavBar';
import { apiCall } from '../helpers';

function Dashboard ({ token }) {
  const [newGameShow, setNewGameShow] = React.useState(false);
  const [quizzes, setQuizzes] = React.useState([]);
  const [newQuizName, setNewQuizName] = React.useState('');

  async function fetchAllQuizzes () {
    const data = await apiCall('admin/quiz', 'GET')
    if (data.error) {
      console.log('TODO error getting quizes ', data);
      return;
    }
    setQuizzes(data.quizzes);
  }

  React.useEffect(async () => {
    await fetchAllQuizzes();
  }, [newGameShow]);

  async function createNewGame () {
    const response = await apiCall('admin/quiz/new', 'POST', { name: newQuizName })
    if (response.error) {
      console.log('TODO error creating new quiz ', response);
      return;
    }
    await fetchAllQuizzes();
  }

  // TODO: break into more compoennts
  return (
    <>
      <NavBar />
      Dashboard! list games...<br />
      {quizzes.map(quiz => (
        <>
          <b>{quiz.name}</b><br />
        </>
      ))}
      <br /><hr /><br />
      <button onClick={() => setNewGameShow(!newGameShow)}>
        {newGameShow ? 'Hide' : 'Show'} Create New Game</button>
      {newGameShow && (
        <>
          <br />
          Form here for new game!<br />
          Name: <input value={newQuizName} onChange={(e) => setNewQuizName(e.target.value)}/><br />
          <Button sx={{ paddingTop: '10px', paddingBottom: '10px' }} variant="contained" onClick={createNewGame}>Create new game</Button>
        </>
      )}
    </>
  )
}

export default Dashboard;
