import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiCall } from '../helpers';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

// results.position === -1 means Lobby time.
// results.position === 0 means question 1.
// results.position === results.questions.length means End of quiz.

function QuizControl () {
  const navigate = useNavigate();
  const params = useParams();
  const [controlAlert, setControlAlert] = React.useState('');
  const [results, setResults] = React.useState({ active: false, position: -1 });

  // Fetch session status on first render
  React.useEffect(async () => {
    updateResults();
  }, []);

  // Debug
  React.useEffect(async () => {
    console.log(results);
  }, [results]);

  // Returns string describing position/stage of session
  const getCurrentStage = () => {
    const pos = results.position;
    switch (pos) {
      case -1:
        return 'Lobby';
      case results.questions.length:
        return 'Quiz Finished';
      default:
        return `Question ${pos + 1}`;
    }
  }

  // Handle back button
  const handleBack = () => {
    navigate(-1);
  }

  const handleNextQuestion = async () => {
    const response = await apiCall(`admin/quiz/${params.quizID}/advance`, 'POST');
    if (response.error) {
      setControlAlert('Quiz advance error: ' + response.error);
      return;
    }
    updateResults();
  }

  const handleStopGame = async () => {
    const response = await apiCall(`admin/quiz/${params.quizID}/end`, 'POST');
    if (response.error) {
      setControlAlert('Quiz end error: ' + response.error);
      return;
    }
    updateResults();
  }

  const updateResults = async () => {
    const response = await apiCall(`admin/session/${params.sessionID}/status`, 'GET');
    if (response.error) {
      setControlAlert("Couldn't get session info: " + response.error);
      return;
    }
    setResults(response.results);
  }

  return (
    <>
      <div>
        <button onClick={handleBack}>Back</button>
      </div>
      <div>
        {'Current stage: ' + getCurrentStage()}
      </div>
      <div>
        <Button
          onClick={handleNextQuestion}
          disabled={!results.active}
        >
          { results.position === '-1'
            ? 'Next Question'
            : 'Start Quiz'
          }
        </Button>
        <Button
          onClick={handleStopGame}
          disabled={!results.active}
        >
          Stop Game
        </Button>
      </div>
      { controlAlert && (
            <Alert severity='error' onClose={() => setControlAlert(null)}>
              {controlAlert}
            </Alert>
      )}
      { /* TODO probably make something like in Kahoot with boxes, editable as well */ }
      { (results.active && results.position !== -1) &&
          <div>{results.questions[results.position]}</div>
      }
      { results.active &&
          <div>Component that shows graphs and stuff</div>
      }
    </>
  )
}

export default QuizControl;
