import React from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../helpers';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import GameCard from '../components/GameCard';

function Dashboard () {
  const [newGameShow, setNewGameShow] = React.useState(false);
  const [newQuizError, setNewQuizError] = React.useState('');
  const [newQuizName, setNewQuizName] = React.useState('');
  const [quizError, setQuizError] = React.useState('');
  const [quizzes, setQuizzes] = React.useState([]);
  const navigate = useNavigate();

  // Fetch quizzes
  async function fetchAllQuizzes () {
    const data = await apiCall('admin/quiz', 'GET')
    if (data.error) {
      setQuizError(data.error);
      return;
    }
    // Get quiz questions as well
    for (const quiz of data.quizzes) {
      const questions = await apiCall('admin/quiz/' + quiz.id, 'GET');
      if (data.error) {
        setQuizError(`Error getting questions of Quiz ID ${quiz.id}, ${data.error}`);
        return;
      }
      quiz.questions = questions.questions;
    }
    setQuizzes(data.quizzes);
  }

  // Fetch quizzes on first render
  React.useEffect(async () => {
    await fetchAllQuizzes();
  }, []);

  // Handle create new game button
  async function createNewGame () {
    const response = await apiCall('admin/quiz/new', 'POST', { name: newQuizName })
    if (response.error) {
      setNewQuizError(response.error);
      return;
    }
    await fetchAllQuizzes();
  }

  // Handle Quiz Delete button
  const handleQuizDelete = async (id) => {
    const response = await apiCall('admin/quiz/' + id, 'DELETE');
    if (response.error) {
      // This should not be possible
      // console.log(`Quiz delete error, id ${id}, ${response.error}`)
      return;
    }
    await fetchAllQuizzes();
  }

  // Handle Quiz Edit button
  const handleQuizEdit = async (id) => {
    navigate('/quiz/edit/' + id);
  }

  // TODO: break into more compoennts
  return (
    <>
      <div>Dashboard!</div>
      <div>
        <button onClick={() => setNewGameShow(!newGameShow)}>
          {newGameShow ? 'Hide' : 'Show'} Create New Game
        </button>
        {newGameShow && (
          <>
            <br />
            Form here for new game!<br />
            Name: <input value={newQuizName} onChange={(e) => setNewQuizName(e.target.value)}/><br />
            <Button sx={{ paddingTop: '10px', paddingBottom: '10px' }} variant="contained" onClick={createNewGame}>Create new game</Button>
            { newQuizError && (
              <Alert severity="error" onClose={() => setNewQuizError('')}>
                {newQuizError}
              </Alert>
            )}
          </>
        )}
      </div>
      <div>
        List of games:<br />
        {quizzes.map(quiz => (
          <div key={quiz.id}>
            <GameCard quiz={quiz} handleEdit={handleQuizEdit} handleDelete={handleQuizDelete} />
          </div>
        ))}
        { quizError && (
          <Alert severity="error" onClose={() => setQuizError('')}>
            {quizError}
          </Alert>
        )}
      </div>
      <hr />
    </>
  )
}

export default Dashboard;
