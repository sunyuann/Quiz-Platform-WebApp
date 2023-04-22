import React from 'react';
import { useParams } from 'react-router-dom';
import { apiCall } from '../helpers';
import AnswerBoxes from '../components/AnswerBoxes';
import BackButton from '../components/BackButton'
import CatPics from '../components/CatPics';
import MediaDisplay from '../components/MediaDisplay';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TableTwoCol from '../components/TableTwoCol';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';

function Play () {
  const params = useParams();
  const [answers, setAnswers] = React.useState([]);
  const [answersChecked, setAnswersChecked] = React.useState([]);
  const [count, setCount] = React.useState(null);
  const [disabled, setDisabled] = React.useState([]);
  const [name, setName] = React.useState('');
  const [playAlert, setPlayAlert] = React.useState(null);
  const [playerID, setPlayerID] = React.useState(null);
  const [question, setQuestion] = React.useState(null);
  const [sessionID, setSessionID] = React.useState(params.sessionID ? params.sessionID : '');
  const [started, setStarted] = React.useState(false);
  const [results, setResults] = React.useState(null);
  const [wrongs, setWrongs] = React.useState([]);

  // Poll to see if Quiz has started
  React.useEffect(() => {
    const intervalId = setInterval(async () => {
      if (playerID && !started) {
        const data = await apiCall(`play/${playerID}/status`, 'GET');
        if (data.error) {
          setPlayAlert('Error joining Session: ' + data.error);
          return;
        }
        setStarted(data.started);
      }
    }, 50);
    return () => {
      clearInterval(intervalId);
    };
  }, [playerID, started]);

  // Get Question info when Quiz has started
  React.useEffect(() => {
    const doAsync = async () => {
      const data = await apiCall(`play/${playerID}/question`, 'GET');
      const newAnswers = [];
      for (const answer of data.question.answers) {
        newAnswers.push(answer.content)
      }
      setAnswers(newAnswers);
      setQuestion(data.question);
      const startTime = new Date(data.question.isoTimeLastQuestionStarted);
      const endTime = new Date(startTime.getTime() + data.question.timeLimit * 1000);
      const timeNow = new Date();
      const diff = Math.floor((endTime - timeNow) / 1000);
      setCount(diff);
    }
    if (playerID && started) {
      doAsync();
    }
  }, [started]);

  // Handles countdown
  React.useEffect(() => {
    const updateCount = () => {
      if (started) {
        const newCount = count - 1;
        if (newCount === 0) {
          setDisabled(new Array(answers.length).fill(true));
        }
        if (newCount === -1) {
          showAnswers();
          checkForNewQuestion();
        }
        if (newCount >= -1) {
          setCount(() => { return newCount; })
        }
      }
    }
    const intervalId = setInterval(updateCount, 1000);
    return () => {
      clearInterval(intervalId);
    }
  }, [count]);

  // Fetch /question and determine what to do
  const checkForNewQuestion = async () => {
    const data = await apiCall(`play/${playerID}/question`, 'GET');
    if (data.error === 'Session ID is not an active session') {
      // End of quiz reached
      const dataEnd = await apiCall(`play/${playerID}/results`, 'GET');
      const tableData = []
      for (const idx in dataEnd) {
        const result = dataEnd[idx];
        tableData.push({
          col1: `Question ${Number(idx) + 1}:`,
          col2: result.correct ? 'correct' : 'incorrect'
        })
      }
      setResults(tableData);
      return;
    }
    if (question.isoTimeLastQuestionStarted === data.question.isoTimeLastQuestionStarted) {
      setTimeout(checkForNewQuestion, 50);
      return;
    }
    // New question baby!
    const newAnswers = [];
    for (const answer of data.question.answers) {
      newAnswers.push(answer.content)
    }
    setAnswers(newAnswers);
    setQuestion(data.question);
    setAnswersChecked([]);
    setDisabled([]);
    setWrongs([]);
    setCount(data.question.timeLimit);
  }

  // When countdown === 0, get and show answers
  const showAnswers = async () => {
    const data = await apiCall(`play/${playerID}/answer`, 'GET');
    if (data.error === 'Question time has not been completed') {
      setCount(0);
    }
    const newDisabled = new Array(answers.length).fill(true);
    const newCorrects = new Array(answers.length).fill(false);
    for (const id of data.answerIds) {
      // Green shape for correct answers
      newCorrects[id] = true;
    }
    // Set player selected answers as wrong
    setWrongs(answersChecked);
    // Set correct answers as right, will override wrongs
    setAnswersChecked(newCorrects);
    // Disable answers
    setDisabled(newDisabled);
  }

  // Handles player clicking an AnswerBox
  const handleAnswerClick = async (index) => {
    if (index < answers.length) {
      let newChecked;
      if (question.questionType === 'singleChoice') {
        newChecked = new Array(answers.length).fill(false);
      } else {
        newChecked = [...answersChecked];
      }
      newChecked[index] = !newChecked[index];
      // For multiChoice, don't unselect the last one
      if (newChecked.every(elem => elem === false)) {
        newChecked = [...answersChecked];
      }
      setAnswersChecked(newChecked);
      const answerIds = newChecked.reduce((total, item, index) => {
        if (item) {
          total.push(index);
        }
        return total;
      }, []);
      const response = await apiCall(`play/${playerID}/answer`, 'PUT', { answerIds });
      if (response.error) {
        setPlayAlert('Error submitting answer to server: ' + response.error);
      }
    } else {
      setPlayAlert(`You somehow clicked on an answer index ${index} when there are only ${answers.length} answers.`);
    }
  }

  const handleNameState = (event) => {
    setName(event.target.value);
  }

  const handleSessionIDState = (event) => {
    setSessionID(event.target.value);
  }

  const handleSessionJoin = async () => {
    const data = await apiCall(`play/join/${sessionID}`, 'POST', { name });
    if (data.error) {
      setPlayAlert('Error joining Session: ' + data.error);
      return;
    }
    setPlayerID(data.playerId);
  }

  return (
    <>
      <BackButton />
      { playerID
        ? (started && question)
            ? results
              ? (<>
                { /* Results Screen */ }
                <div>
                  <TableTwoCol
                    col1Head='Question'
                    col2Head='Answer is'
                    data={results}
                  />
                </div>
                </>)
              : (<>
                { /* Question Screen */ }
                <div>
                  {question.question}
                </div>
                <MediaDisplay
                  mediaType={question.mediaAttachmentType}
                  media={question.mediaAttachment}
                />
                <div>
                  Seconds left: {count >= 0 ? count : 0}
                </div>
                <div>
                  <AnswerBoxes
                    height="500px"
                    answers={answers}
                    corrects={answersChecked}
                    wrongs={wrongs}
                    disabled={disabled}
                    handleClick={handleAnswerClick}
                  />
                </div>
                <Typography variant="body1" sx={{ marginTop: '40px' }}>
                  NOTE: The scoring system is the product of the time taken to complete a question and the number of points a question is worth.
                  The faster you get the answer, the higher your marks are. But remember to make sure to get the correct answer, or you won&apos;t get any points!
                </Typography>
              </>)
            : (<>
              { /* Lobby Screen */ }
              <Typography variant="h6">
                We are in! Please wait for the admin to start the quiz.
              </Typography>
              <Typography variant="body1" sx={{ marginTop: '5px' }}>
                NOTE: The scoring system is the product of speed taken to complete a question and the number of points a question is worth. (i.e. Time remaining multiplied by Question Points)
                The faster you get the answer, the higher your marks are. But remember to make sure to get the correct answer, or you won&apos;t get any points!
              </Typography>
              <CatPics />
            </>)
        : (<>
          { /* Join Session Screen */ }
          <div>
            <InputLabel sx={{ marginTop: '10px' }}>Game Session ID</InputLabel>
            <TextField
              value={sessionID}
              onChange={handleSessionIDState}
              placeholder="Enter the Game's Session ID here"
              sx={{ marginBottom: '10px', width: '40ch' }}
            />
            <InputLabel>Your Name</InputLabel>
            <TextField
              value={name}
              onChange={handleNameState}
              placeholder="Enter your name here"
              sx={{ marginBottom: '10px', width: '40ch' }}
            />
          </div>
          <div>
            <Button variant="contained" size='large' onClick={handleSessionJoin} >Play!</Button>
          </div>
        </>)

      }
      { playAlert && (
        <Alert severity='error' onClose={() => setPlayAlert(null)}>
          {playAlert}
        </Alert>
      )}
    </>
  )
}

export default Play;
