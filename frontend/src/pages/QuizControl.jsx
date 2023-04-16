import React from 'react';
import { useParams } from 'react-router-dom';
import { apiCall } from '../helpers';
import AnswerBoxes from '../components/AnswerBoxes';
import BackButton from '../components/BackButton';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

// status.position === -1 means Lobby time.
// status.position === 0 means question 1.
// status.position === status.questions.length means End of quiz.

function QuizControl () {
  const params = useParams();
  const [controlAlert, setControlAlert] = React.useState('');
  const [answers, setAnswers] = React.useState([]);
  const [results, setResults] = React.useState([]);
  const [status, setStatus] = React.useState({ active: true, position: -1 });

  // Fetch session status and results on first render
  React.useEffect(() => {
    updateStatus();
  }, []);

  // When status changes, update answers
  // When status.active is false, get results
  React.useEffect(async () => {
    console.log('status ', status);
    if (status.active && status.position !== -1) {
      setAnswers(status.questions[status.position].answers.map((item) => item.content));
    }
    if (!status.active) {
      const data = await apiCall(`admin/session/${params.sessionID}/results`, 'GET');
      if (data.error) {
        setControlAlert('Failed to get results: ' + data.error);
        return;
      }
      setResults(data);
    }
  }, [status]);

  // Debug
  React.useEffect(() => {
    console.log('results ', results);
  }, [results]);

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
      <BackButton />
      <div>
        {'Current stage: ' + getCurrentStage()}
      </div>
      <div>
        {'Players: ' + status.players}
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
          <AnswerBoxes height="500px" answers={answers} handleClick={() => {}} />
          </>
      }
      { !status.active &&
          (<>
            <div>Component that shows graphs and stuff</div>
            <div>{JSON.stringify(results)}</div>
          </>)
      }
    </>
  )
}

export default QuizControl;
