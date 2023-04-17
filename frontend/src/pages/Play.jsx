import React from 'react';
import { useParams } from 'react-router-dom';
import { apiCall } from '../helpers';
import AnswerBoxes from '../components/AnswerBoxes';
import BackButton from '../components/BackButton'
import MediaDisplay from '../components/MediaDisplay';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

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
  const [wrongs, setWrongs] = React.useState([]);

  // Debug
  React.useEffect(async () => {
    console.log('started ', started)
    const data = await apiCall(`play/${playerID}/results`, 'GET');
    console.log('results GET ', data);
  }, [started]);

  // Poll to see if Quiz has started
  React.useEffect(() => {
    if (playerID && !started) {
      const intervalId = setInterval(async () => {
        const data = await apiCall(`play/${playerID}/status`, 'GET');
        console.log('GET status ', data)
        if (data.error) {
          setPlayAlert('Error joining Session: ' + data.error);
          return;
        }
        setStarted(data.started);
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [playerID, started]);

  // Get Question info when Quiz has started
  React.useEffect(() => {
    const doAsync = async () => {
      const data = await apiCall(`play/${playerID}/question`, 'GET');
      console.log('question GET ', data);
      const newAnswers = [];
      for (const answer of data.question.answers) {
        newAnswers.push(answer.content)
      }
      console.log('newAnswers ', newAnswers);
      setAnswers(newAnswers);
      setQuestion(data.question);
      setCount(data.question.timeLimit);
    }
    if (playerID && started) {
      doAsync();
    }
  }, [started]);

  // Handles countdown
  React.useEffect(() => {
    if (started) {
      const updateCount = () => {
        const newCount = count - 1;
        console.log('count ', newCount, ' bool ', newCount < 1);
        if (newCount < 0) {
          showAnswers();
        } else {
          setCount(() => { return newCount; })
        }
      }
      setTimeout(updateCount, 1000);
    }
  }, [count]);

  // When countdown === 0, get and show answers
  const showAnswers = async () => {
    const data = await apiCall(`play/${playerID}/answer`, 'GET');
    console.log('answer GET ', data);
    const newDisabled = new Array(answers.length).fill(true);
    const newCorrects = new Array(answers.length).fill(false);
    for (const id of data.answerIds) {
      newCorrects[id] = true;
      newDisabled[id] = false;
    }
    // Don't disable answers related to player selected or correct answers
    for (const idx in answersChecked) {
      if (answersChecked[idx]) {
        newDisabled[idx] = false;
      }
    }
    setWrongs(answersChecked);
    // Set player selected answers as wrong
    setAnswersChecked(newCorrects);
    // Set correct answers as right, will override wrongs
    setDisabled(newDisabled);
    // Disable other answers
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
      setAnswersChecked(newChecked);
      const answerIds = newChecked.reduce((total, item, index) => {
        if (item) {
          total.push(index);
        }
        return total;
      }, []);
      console.log(answerIds);
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
            ? (<>
              { /* Question Screen */ }
              <div>
                {question.question}
              </div>
              <MediaDisplay
                mediaType={question.mediaAttachmentType}
                media={question.mediaAttachment}
              />
              <div>
                Seconds left: {count}
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
              </>)
            : (<>
              { /* Lobby Screen */ }
              <div>
                We are in!
              </div>
            </>)
        : (<>
          { /* Join Session Screen */ }
          <div>
            <TextField
              fullWidth
              label="Session ID"
              placeholder="Enter the Game's Session ID Here"
              InputLabelProps={{
                shrink: true,
              }}
              value={sessionID}
              onChange={handleSessionIDState}
            />
          </div>
          <div>
            <TextField
              fullWidth
              label="Your Name"
              placeholder="Enter your name here"
              InputLabelProps={{
                shrink: true,
              }}
              value={name}
              onChange={handleNameState}
            />
          </div>
          <div>
            <Button onClick={handleSessionJoin} >Play!</Button>
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
