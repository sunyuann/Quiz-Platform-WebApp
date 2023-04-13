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
  const [quiz, setQuiz] = React.useState(null);
  const [quizName, setQuizName] = React.useState('');
  const [questionEditError, setQuestionEditError] = React.useState('');
  const [questionType, setQuestionType] = React.useState('');
  const [timeLimit, setTimeLimit] = React.useState(null);
  const [points, setPoints] = React.useState(null);
  const [mediaAttachmentOrig, setOrigMediaAttachmentOrig] = React.useState('');
  const [mediaAttachment, setMediaAttachment] = React.useState('');
  const [mediaAttachmentDisplay, setMediaAttachmentDisplay] = React.useState(null);
  const [mediaAttachmentType, setMediaAttachmentType] = React.useState('');
  const [mediaAttachmentUploadURL, setMediaAttachmentUploadURL] = React.useState('');
  const [mediaAttachmentError, setMediaAttachmentError] = React.useState('');
  const [question, setQuestion] = React.useState('');
  const [answers, setAnswers] = React.useState([]);

  // Fetch question to edit on first render
  React.useEffect(async () => {
    const data = await apiCall('admin/quiz/' + params.id);
    if (data.error) {
      setQuestionEditError(data.error);
      return;
    }
    const questionInfo = JSON.parse(data.questions[params.questionId - 1]);
    setQuiz(data);
    setQuizName(data.name);
    setQuestionType(questionInfo.questionType);
    setTimeLimit(questionInfo.timeLimit);
    setPoints(questionInfo.points);
    setOrigMediaAttachmentOrig(questionInfo.mediaAttachment);
    setMediaAttachment(questionInfo.mediaAttachment);
    setMediaAttachmentType(questionInfo.mediaAttachmentType);
    setQuestion(questionInfo.question);
    setAnswers(questionInfo.answers);
  }, []);

  // render image on page load and on file input
  React.useEffect(async () => {
    if (mediaAttachment === 'none') {
      setMediaAttachmentDisplay(<>There is currently no image or video attached to this question.</>);
    } else if (mediaAttachment === 'no image inserted') {
      setMediaAttachment(mediaAttachmentOrig);
    } else if (mediaAttachmentType === 'image') {
      setMediaAttachmentDisplay(
        <img src={mediaAttachment}
          alt={'Media attachment of Quiz ' + params.id + ' Question ' + params.questionId}
        />
      );
    } else if (mediaAttachmentType === 'url') {
      setMediaAttachmentDisplay(
        <iframe src={mediaAttachment}
          type="text/html"
          width="711"
          height="400"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media;"
          allowFullScreen
          title="Youtube video media.">
        </iframe>
      )
    } else {
      setMediaAttachmentDisplay(<>Error, this should not happen.</>);
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

  // Handle media attachment state for images
  const handleMediaAttachmentStateImage = async (event) => {
    if (event.target.files.length > 0) {
      setMediaAttachmentType('image');
      const image = await fileToDataUrl(event.target.files[0]);
      setMediaAttachment(image);
    } else {
      setMediaAttachmentType('none');
      setMediaAttachment('no image inserted');
    }
  }

  // Handle media attachment upload url state
  const handleMediaAttachmentUploadURLState = (event) => {
    setMediaAttachmentUploadURL(event.target.value);
  }

  // Removes media attachment upload url state to default
  const deleteMediaAttachmentState = async () => {
    setMediaAttachmentType('none');
    setMediaAttachment('no image inserted');
  }

  // on upload, grab url input from text field and insert video
  const uploadMediaAttachmentStateURL = async () => {
    if (mediaAttachmentUploadURL !== '' || mediaAttachmentUploadURL === null) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/;
      const match = mediaAttachmentUploadURL.match(regExp);
      if (match && match[2].length === 11) {
        // $('#ytplayerSide').attr('src', 'https://www.youtube.com/embed/' + match[2] + '?autoplay=0');
        setMediaAttachmentType('url');
        setMediaAttachment('https://www.youtube.com/embed/' + match[2] + '?autoplay=0');
        setMediaAttachmentError('');
      } else {
        setMediaAttachmentError('Invalid URL, please try again.');
      }
    } else {
      setMediaAttachmentError('No URL inserted, please insert URL.');
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
    setQuestionEditError('');
    const newAnswer = { content: '', isCorrect: false };
    setAnswers([...answers, newAnswer]);
  }

  // Handle answers isCorrect state
  const handleAnswerIsCorrect = (event, index) => {
    setQuestionEditError('');
    const tempAnswers = answers;
    tempAnswers[index].isCorrect = event.target.checked;
    setAnswers(tempAnswers);
  }

  // Handle answer content state
  const handleAnswerContent = (event, index) => {
    setQuestionEditError('');
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
    setQuestionEditError('');
    const tempAnswers = [...answers];
    tempAnswers.splice(index, 1);
    setAnswers(tempAnswers);
  }

  // save question data on submit
  const handleSubmit = () => {
    const updatedQuestion = {
      questionType,
      timeLimit,
      points,
      mediaAttachment,
      mediaAttachmentType,
      question,
      answers,
    };
    const tempQuestions = quiz.questions;
    tempQuestions[params.questionId - 1] = JSON.stringify(updatedQuestion);
    updateQuestions(tempQuestions);
  }

  // Only set new state if update to server is good
  const updateQuestions = async (questions) => {
    const response = await apiCall('admin/quiz/' + params.id, 'PUT', { questions });
    if (response.error) {
      setQuestionEditError(response.error);
      return;
    }
    setQuiz((prevState) => {
      return {
        ...prevState,
        questions
      }
    })
  }

  return (
    <>
      <button onClick={handleBack}>Back</button>
      <h1>Quiz: {quizName}</h1>
      <h2>Question {params.questionId}</h2>
      {/* TODO: next question and previous question edit button? */}
      <div>
        <FormControl>
        <FormLabel id="question-edit-type-label">Question Type</FormLabel>
        <RadioGroup
          row
          aria-labelledby="question-edit-type-label"
          name="question-edit-type-label"
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
                label="Time Limit"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                value={timeLimit}
                onChange={handleTimeLimitState}
          />
          <TextField
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
      {mediaAttachmentDisplay}
      <div style={{ marginBottom: '10px', marginTop: '10px' }}>
        <Button
          variant="contained"
          component="label"
        >
          Upload Image
          <input
            hidden
            accept="image/*"
            multiple type="file"
            placeholder='Upload image'
            onChange={handleMediaAttachmentStateImage}
          />
        </Button>
      </div>
      <div>
        <TextField
          label='Enter youtube URL here'
          InputLabelProps={{
            shrink: true,
          }}
          value={mediaAttachmentUploadURL}
          onChange={handleMediaAttachmentUploadURLState}
        />
        <Button
          variant="contained"
          size="large"
          style={{ paddingTop: '14.5px', paddingBottom: '14.5px', marginLeft: '3px' }}
          onClick={uploadMediaAttachmentStateURL}
        >
          Upload URL
        </Button>
      </div>
      <Button
        variant="contained"
        size="large"
        style={{ marginTop: '5px' }}
        onClick={deleteMediaAttachmentState}
      >
        Remove Image or Video
      </Button>

      { mediaAttachmentError && (
        <Alert severity="error" onClose={() => setMediaAttachmentError('')}>
          {mediaAttachmentError}
        </Alert>
      )}
      <br /><br />
      <TextField fullWidth sx={{ m: 0.2 }}
        label="Question"
        placeholder="Enter question here"
        InputLabelProps={{
          shrink: true,
        }}
        value={question}
        onChange={handleQuestionState}
      />

      {<Box sx={{ '& > :not(style)': { m: 1 } }}>
          <FormLabel component="legend">Answers</FormLabel>
          {answers.map((answer, index) => (
            <div key={index}>
              <Input
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
      </Box>}
      <Button variant="contained" onClick={insertAnswer}>Add new answer</Button>
      <FormHelperText>Use checkbox to indicate one (or more) correct answers. Select from a range of 2 to 6 answer choices.</FormHelperText>
      { questionEditError && (
        <Alert severity="error" onClose={() => setQuestionEditError('')}>
          {questionEditError}
        </Alert>
      )}

    <Button variant="contained" onClick={handleSubmit}>Save changes</Button>
    </>
  )
}

export default QuestionEdit;
