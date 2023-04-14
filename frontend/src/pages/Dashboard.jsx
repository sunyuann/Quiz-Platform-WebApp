import React from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall, BACKEND_PORT } from '../helpers';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import GameCard from '../components/GameCard';
import GamePopup from '../components/GamePopup';

function Dashboard () {
  const [newGameShow, setNewGameShow] = React.useState(false);
  const [newQuizError, setNewQuizError] = React.useState('');
  const [newQuizName, setNewQuizName] = React.useState('');
  const [quizError, setQuizError] = React.useState('');
  const [quizStopped, setQuizStopped] = React.useState('');
  const [quizzes, setQuizzes] = React.useState([]);
  const [sessionID, setSessionID] = React.useState('');
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

  // Handle Quiz Control panel button (and QuizStopPopupYes button)
  const handleQuizControl = (quizID, sessionID) => {
    navigate(`/quiz/control/${quizID}/${sessionID}`);
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
  const handleQuizEdit = (id) => {
    navigate('/quiz/edit/' + id);
  }

  // Handle Quiz Start button
  const handleQuizStart = async (id) => {
    const response = await apiCall(`admin/quiz/${id}/start`, 'POST');
    if (response.error) {
      setNewQuizError(`Error starting quiz ${id}: ${response.error}`);
      return;
    }
    const data = await apiCall('admin/quiz/' + id, 'GET');
    if (data.error) {
      setNewQuizError(`Error getting game info ${id}: ${response.error}`);
    }
    if (data.active) {
      updateQuizActiveState(id, data.active)
      setSessionID(data.active);
    } else {
      setNewQuizError(`Backend did not set Quiz ${id} as active`);
    }
  }

  // Handle Quiz Start Popup Copy button
  const handleQuizStartCopy = () => {
    navigator.clipboard.writeText(`localhost:${BACKEND_PORT}/play/${sessionID}`);
  }

  // Handle Quiz Stop button
  const handleQuizStop = async (id, sessionID) => {
    const response = await apiCall(`admin/quiz/${id}/end`, 'POST');
    if (response.error) {
      setNewQuizError(`Error stopping quiz ${id}: ${response.error}`);
      return;
    }
    const data = await apiCall('admin/quiz/' + id, 'GET');
    if (data.error) {
      setNewQuizError(`Error getting game info ${id}: ${response.error}`);
    }
    if (data.active) {
      setNewQuizError(`Backend did not stop Quiz ${id}, sessionID: ${sessionID}`);
    } else {
      updateQuizActiveState(id, data.active)
      setQuizStopped({ quizID: id, sessionID });
    }
  }

  // Handle Popup close
  const handleQuizPopupClose = () => {
    setSessionID('');
    setQuizStopped('');
  }

  // Update Quiz State for Start/Stop button
  const updateQuizActiveState = (quizID, sessionID) => {
    const newQuizzes = [...quizzes];
    for (const quiz of newQuizzes) {
      if (quiz.id === quizID) {
        quiz.active = sessionID;
      }
    }
    setQuizzes(newQuizzes);
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
          </>
        )}
        { newQuizError && (
              <Alert severity="error" onClose={() => setNewQuizError('')}>
                {newQuizError}
              </Alert>
        )}
      </div>
      <div>
        List of games:<br />
        {quizzes.map(quiz => (
          <div key={quiz.id}>
            <GameCard
              quiz={quiz}
              handleStart={handleQuizStart}
              handleEdit={handleQuizEdit}
              handleDelete={handleQuizDelete}
              handleStop={handleQuizStop}
              handleControl={handleQuizControl}
            />
          </div>
        ))}
        { quizError && (
          <Alert severity="error" onClose={() => setQuizError('')}>
            {quizError}
          </Alert>
        )}
      </div>
      <hr />
      {sessionID &&
        <GamePopup
          title="Game Session ID"
          description={sessionID}
          yesText="Copy URL"
          handleYes={handleQuizStartCopy}
          handleClose={handleQuizPopupClose}
        />
      }
      {quizStopped &&
        <GamePopup
          title={`Game ${quizStopped.sessionID} Stopped`}
          description="Would you like to view the results?"
          yesText="Yes"
          handleYes={() => handleQuizControl(quizStopped.quizID, quizStopped.sessionID)}
          handleClose={handleQuizPopupClose}
        />
      }
    </>
  )
}

export default Dashboard;
