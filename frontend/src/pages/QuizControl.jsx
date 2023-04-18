import React from 'react';
import { useParams } from 'react-router-dom';
import { apiCall } from '../helpers';
import AnswerBoxes from '../components/AnswerBoxes';
import BackButton from '../components/BackButton';
import ColumnChart from '../components/ColumnChart';
import TableTwoCol from '../components/TableTwoCol';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

// status.position === -1 means Lobby time.
// status.position === 0 means question 1.
// status.position === status.questions.length means End of quiz.

function QuizControl () {
  const params = useParams();
  const [avgAnswer, setAvgAnswer] = React.useState(null);
  const [controlAlert, setControlAlert] = React.useState('');
  const [correctData, setCorrectData] = React.useState(null)
  const [answers, setAnswers] = React.useState([]);
  const [results, setResults] = React.useState(null);
  const [status, setStatus] = React.useState({ active: true, position: -1 });
  const [topPlayers, setTopPlayers] = React.useState(null);

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
      getResults();
    }
  }, [status]);

  // Do table and charts when we have results
  React.useEffect(() => {
    if (results) {
      // Top 5
      const playerScores = results.map((player) => ({
        col1: player.name,
        col2: getPlayerPoints(player, status.questions),
      }));
      const sortedPlayerScores = playerScores.sort(
        (a, b) => b.col2 - a.col2
      );
      const topFive = sortedPlayerScores.slice(0, 5);
      setTopPlayers(topFive);
      // Correct Percentage
      const correctCounts = status.questions.map((_, idx) =>
        results.filter((res) => res.answers[idx].correct).length
      );
      const correctPercentages = correctCounts.map(
        (count) => (count / results.length) * 100
      );
      const correctDataPoints = status.questions.map((_, idx) => ({
        label: `Question ${idx + 1}`,
        y: correctPercentages[idx],
      }))
      setCorrectData(correctDataPoints);
      // Avg Answer Time
      const answerTimes = status.questions.map((_, idx) => {
        const totalAnswerTime = results.reduce((total, res) => {
          const timeDiff =
            new Date(res.answers[idx].answeredAt) -
            new Date(res.answers[idx].questionStartedAt);
          return total + (timeDiff / 1000);
        }, 0);
        return totalAnswerTime / results.length;
      });
      const avgAnswerPoints = status.questions.map((_, idx) => ({
        label: `Question ${idx + 1}`,
        y: answerTimes[idx],
      }))
      setAvgAnswer(avgAnswerPoints);
    }
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

  const getResults = async () => {
    const data = await apiCall(`admin/session/${params.sessionID}/results`, 'GET');
    if (data.error) {
      setControlAlert('Failed to get results: ' + data.error);
      return;
    }
    setResults(data.results);
  }

  // For a player from results, get their total points using status.questions
  const getPlayerPoints = (player, questions) => {
    return player.answers.reduce((total, answer, idx) => {
      return total + (answer.correct ? questions[idx].points : 0);
    }, 0);
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
        {'Players: ' + (status.players && status.players.length ? status.players.join(', ') : 'None.')}
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
      { topPlayers &&
        (<>
          <h2>Top 5 Players</h2>
          <TableTwoCol
            col1Head='Players'
            col2Head='Points'
            data={topPlayers}
          />
        </>)
      }
      { correctData &&
        <ColumnChart
          title='Percentage of Correct Answers'
          xTitle='Questions'
          yTitle='Percentage Correct'
          data={correctData}
        />
      }
      { avgAnswer &&
        <ColumnChart
          title='Average Answer Time'
          xTitle='Questions'
          yTitle='Time (s)'
          data={avgAnswer}
        />
      }
    </>
  )
}

export default QuizControl;
