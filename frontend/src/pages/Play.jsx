import React from 'react';
import { useParams } from 'react-router-dom';
import { apiCall } from '../helpers';
import BackButton from '../components/BackButton'
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function Play () {
  const params = useParams();
  const [name, setName] = React.useState('');
  const [playAlert, setPlayAlert] = React.useState(null);
  const [playerID, setPlayerID] = React.useState(null);
  const [sessionID, setSessionID] = React.useState(params.sessionID ? params.sessionID : '');
  const [started, setStarted] = React.useState(false);

  // Poll to see if Quiz has started
  React.useEffect(() => {
    if (playerID && !started) {
      const intervalId = setInterval(async () => {
        const data = await apiCall(`play/${playerID}/status`, 'GET');
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

  // Debug
  React.useEffect(async () => {
    console.log('started ', started)
    let data = await apiCall(`play/${playerID}/question`, 'GET');
    console.log('question GET ', data);
    data = await apiCall(`play/${playerID}/answer`, 'GET');
    console.log('answer GET ', data);
    data = await apiCall(`play/${playerID}/results`, 'GET');
    console.log('results GET ', data);
  }, [started]);

  const handleClick = async () => {
    const data = await apiCall(`play/join/${sessionID}`, 'POST', { name });
    if (data.error) {
      setPlayAlert('Error joining Session: ' + data.error);
      return;
    }
    setPlayerID(data.playerId);
  }

  const handleNameState = (event) => {
    setName(event.target.value);
  }

  const handleSessionIDState = (event) => {
    setSessionID(event.target.value);
  }

  return (
    <>
      <BackButton />
      { playerID
        ? (<>
          <div>
            We are in!
          </div>
        </>)
        : (<>
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
            <Button onClick={handleClick} >Play!</Button>
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