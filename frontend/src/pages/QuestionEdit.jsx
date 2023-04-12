import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiCall, fileToDataUrl } from '../helpers';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

function QuestionEdit () {
  const navigate = useNavigate();
  const params = useParams();
  const [questionEditError, setQuestionEditError] = React.useState('');
  const [questionType, setQuestionType] = React.useState('');
  const [timeLimit, setTimeLimit] = React.useState(null);
  const [points, setPoints] = React.useState(null);
  const [mediaAttachmentOrig, setOrigMediaAttachmentOrig] = React.useState('');
  const [mediaAttachment, setMediaAttachment] = React.useState('');
  const [mediaAttachmentDisplay, setMediaAttachmentDisplay] = React.useState(null);
  const [question, setQuestion] = React.useState('');
  const [answers, setAnswers] = React.useState([]);

  // Fetch quiz to edit on first render
  React.useEffect(async () => {
    const data = await apiCall('admin/quiz/' + params.id);
    if (data.error) {
      setQuestionEditError(data.error);
      return;
    }
    const questionInfo = JSON.parse(data.questions[params.questionId]);
    setQuestionType(questionInfo.questionType);
    setTimeLimit(questionInfo.timeLimit);
    setPoints(questionInfo.points);
    setOrigMediaAttachmentOrig(questionInfo.mediaAttachment);
    setMediaAttachment(questionInfo.mediaAttachment);
    setQuestion(questionInfo.question);
    setAnswers(questionInfo.answers);
  }, []);

  // render image on page load and on file input
  React.useEffect(async () => {
    if (mediaAttachment === 'none') {
      setMediaAttachmentDisplay(<>There is currently no image or video attached to this question.</>);
    } else if (mediaAttachment === 'no image inserted') {
      setMediaAttachment(mediaAttachmentOrig);
    } else {
      setMediaAttachmentDisplay(<img src={mediaAttachment} alt={'Media attachment of Quiz ' + params.id + ' Question ' + params.questionId}/>);
    }
  }, [mediaAttachment]);

  // Handle back button
  const handleBack = () => {
    navigate(-1);
  }

  // Handle question type radio state
  const handleQuestionTypeState = (event) => {
    setQuestionType(event.target.value);
  };

  // Handle time limit state
  const handleTimeLimitState = (event) => {
    setTimeLimit(event.target.value);
  }

  // Handle points state
  const handlePointsState = (event) => {
    setPoints(event.target.value);
  }

  // Handle media attachment state
  const handleMediaAttachmentState = async (event) => {
    if (event.target.files.length > 0) {
      const image = await fileToDataUrl(event.target.files[0]);
      setMediaAttachment(image);
    } else {
      setMediaAttachment('no image inserted');
    }
  }

  // Handle question state
  const handleQuestionState = (event) => {
    setQuestion(event.target.value);
  }

  // insert new answer into answers
  const insertAnswer = () => {
    if (answers.length >= 6) {
      setQuestionEditError('There cannot be more than 6 answers.');
      return;
    }
    const newAnswer = { content: '', isCorrect: false };
    setAnswers([...answers, newAnswer]);
  }

  // Handle answers isCorrect state
  const handleAnswerIsCorrect = (event, index) => {
    const tempAnswers = answers;
    tempAnswers[index].isCorrect = event.target.checked;
    setAnswers(tempAnswers);
  }

  // Handle answer content state
  const handleAnswerContent = (event, index) => {
    const tempAnswers = answers;
    tempAnswers[index].content = event.target.value;
    setAnswers(tempAnswers);
  }

  // Deletes answer
  const deleteAnswer = (event, index) => {
    if (answers.length <= 2) {
      setQuestionEditError('There must be at least 2 or more answers.');
      return;
    }
    const tempAnswers = [...answers];
    tempAnswers.splice(index, 1);
    setAnswers(tempAnswers);
    console.log('answers:', answers);
  }

  return (
    <>
      <button onClick={handleBack}>Back</button>
      {/* TODO: next question and previous question edit button? */}
      <div>
        <FormControl>
        <FormLabel id="demo-controlled-radio-buttons-group">Question Type</FormLabel>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={questionType}
          onChange={handleQuestionTypeState}
        >
          <FormControlLabel value="singleChoice" control={<Radio />} label="Single Choice Question" />
          <FormControlLabel value="multipleChoice" control={<Radio />} label="Multiple Choice Question" />
        </RadioGroup>
        </FormControl>
      </div>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
                id="outlined-number"
                label="Time Limit"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                value={timeLimit}
                onChange={handleTimeLimitState}
          />
          <TextField
              id="outlined-number"
              label="Points available"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              value={points}
              onChange={handlePointsState}
          />
        </div>
      </Box>
      <div style={{ display: 'flex' }}>
        {mediaAttachmentDisplay}
        <input
              type="file"
              accept="image/*"
              placeholder="Upload image"
              onChange={handleMediaAttachmentState}
        />
        {/* TODO: youtube URL input in media attachment, this is not working */}
        <TextField
          id='outlined-basic'
          label='Enter youtube URL (NOT WORKING TODO)'
          variant='outlined'
        />
      </div>
      <TextField fullWidth sx={{ m: 0.2 }}
        id="outlined-number"
        label="Question"
        placeholder="Enter question here"
        InputLabelProps={{
          shrink: true,
        }}
        value={question}
        onChange={handleQuestionState}
      />

      <Box sx={{ '& > :not(style)': { m: 1 } }}>
          <FormLabel component="legend">Answers</FormLabel>
          {answers.map((answer, index) => (
            <div key={index}>
              <Input
                id="input-with-icon-adornment"
                defaultValue={answer.content}
                onChange={e => handleAnswerContent(e, index)}
                startAdornment={
                  <InputAdornment position="start">
                    <Checkbox
                      defaultChecked={answer.isCorrect}
                      onChange={e => handleAnswerIsCorrect(e, index)}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={'delete answer ' + (index + 1)}
                      size='medium'
                      onClick={e => deleteAnswer(e, index)}
                    >
                      <DeleteIcon fontSize='inherit'/>
                    </IconButton>
                  </InputAdornment>
                }
              />
            </div>
          ))}
      </Box>
      <Button variant="contained" onClick={insertAnswer}>Add new question</Button>
      <FormHelperText>Use checkbox to indicate one (or more) correct answers. Select from a range of 2 to 6 answer choices.</FormHelperText>
      { questionEditError && (
        <Alert severity="error" onClose={() => setQuestionEditError('')}>
          {questionEditError}
        </Alert>
      )}
    </>
  )
}

export default QuestionEdit;
