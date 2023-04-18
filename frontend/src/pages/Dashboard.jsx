import React from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../helpers';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import GameCard from '../components/GameCard';
import GamePopup from '../components/GamePopup';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';

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
    navigator.clipboard.writeText(`${window.location.origin}/play/${sessionID}`);
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
      <Typography variant="h3" gutterBottom>
        Dashboard
      </Typography>
      <div>
        <Button variant="contained" size="large" onClick={() => setNewGameShow(!newGameShow)}>
          {newGameShow ? 'Hide' : 'Click here to'} Create New Game
        </Button>
        <hr />
        {newGameShow && (
          <>
            <Typography sx={{ marginLeft: '5px', marginTop: '3px' }} variant="h6" gutterBottom>
                Create new game here
              </Typography>
            <div style={{ marginLeft: '10px', marginTop: '5px' }}>
              <InputLabel>Game Name</InputLabel>
              <TextField
                value={newQuizName}
                onChange={(e) => setNewQuizName(e.target.value)}
                placeholder='Enter game name here'
                sx={{ marginBottom: '10px', width: '25ch' }}
              />
              <div>
                <Button sx={{ paddingTop: '10px', paddingBottom: '10px', marginBottom: '20px' }} variant="contained" size='large' onClick={createNewGame}>Create new game</Button>
              </div>
            </div>
            <hr />
          </>
        )}
        { newQuizError && (
              <Alert severity="error" onClose={() => setNewQuizError('')}>
                {newQuizError}
              </Alert>
        )}
      </div>
      <div>
      <Typography variant="h5" gutterBottom>
        List of games
      </Typography>
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
