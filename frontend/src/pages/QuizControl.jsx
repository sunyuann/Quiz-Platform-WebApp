import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiCall } from '../helpers';
import AnswerBoxes from '../components/AnswerBoxes';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

// status.position === -1 means Lobby time.
// status.position === 0 means question 1.
// status.position === status.questions.length means End of quiz.

function QuizControl () {
  const navigate = useNavigate();
  const params = useParams();
  const [controlAlert, setControlAlert] = React.useState('');
  const [answers, setAnswers] = React.useState([])
  const [status, setStatus] = React.useState({ active: false, position: -1 });

  // Fetch session status on first render
  React.useEffect(async () => {
    updateStatus();
  }, []);

  React.useEffect(async () => {
    console.log(status);
    setAnswers(status.questions[status.position].answers.map((item) => item.content))
  }, [status]);

  // Returns string describing position/stage of session
  const getCurrentStage = () => {
    const pos = status.position;
    switch (pos) {
      case -1:
        return 'Lobby';
      case status.questions.length:
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
    updateStatus();
  }

  const handleStopGame = async () => {
    const response = await apiCall(`admin/quiz/${params.quizID}/end`, 'POST');
    if (response.error) {
      setControlAlert('Quiz end error: ' + response.error);
      return;
    }
    updateStatus();
  }

  const updateStatus = async () => {
    const response = await apiCall(`admin/session/${params.sessionID}/status`, 'GET');
    if (response.error) {
      setControlAlert("Couldn't get session info: " + response.error);
      return;
    }
    setStatus(response.results);
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
          disabled={!status.active}
        >
          { status.position === -1
            ? 'Start Quiz'
            : 'Next Question'
          }
        </Button>
        <Button
          onClick={handleStopGame}
          disabled={!status.active}
        >
          Stop Game
        </Button>
      </div>
      { controlAlert && (
            <Alert severity='error' onClose={() => setControlAlert(null)}>
              {controlAlert}
            </Alert>
      )}
      { /* TODO Adjust height based on window size or something */ }
      { (status.active && status.position !== -1) &&
          <>
          <div>
            {status.questions[status.position].question}
          </div>
          <AnswerBoxes height="500px" answers={answers} handleClick={() => {}}></AnswerBoxes>
          </>
      }
      { !status.active &&
          <div>Component that shows graphs and stuff</div>
      }
    </>
  )
}

export default QuizControl;
