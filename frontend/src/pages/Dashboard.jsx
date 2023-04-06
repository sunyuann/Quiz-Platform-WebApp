import React from 'react';
import Button from '@mui/material/Button';

function Dashboard ({ token }) {
  const [newGameShow, setNewGameShow] = React.useState(false);
  const [quizzes, setQuizzes] = React.useState([]);
  const [newQuizName, setNewQuizName] = React.useState('');

  async function fetchAllQuizzes () {
    const response = await fetch('http://localhost:5005/admin/quiz', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    })
    const data = await response.json();
    setQuizzes(data.quizzes);
  }

  React.useEffect(async () => {
    await fetchAllQuizzes();
  }, [newGameShow]);

  async function createNewGame () {
    await fetch('http://localhost:5005/admin/quiz/new', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newQuizName,
      })
    });
    await fetchAllQuizzes();
  }

  // TODO: break into more compoennts
  return <>
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
  </>;
}

export default Dashboard;
