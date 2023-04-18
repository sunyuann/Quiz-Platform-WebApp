import React from 'react';
import { useParams } from 'react-router-dom';
import { apiCall, fileToDataUrl } from '../helpers';
import BackButton from '../components/BackButton'
import MediaDisplay from '../components/MediaDisplay';
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
  const params = useParams();
  const [quiz, setQuiz] = React.useState(null);
  const [quizName, setQuizName] = React.useState('');
  const [questionEditError, setQuestionEditError] = React.useState('');
  const [questionType, setQuestionType] = React.useState('');
  const [timeLimit, setTimeLimit] = React.useState('');
  const [points, setPoints] = React.useState('');
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
      setQuestionEditError({ severity: 'error', text: data.error });
      return;
    }
    const questionInfo = data.questions[params.questionId - 1];
    setQuiz(data);
    setQuizName(data.name);
    setQuestionType(questionInfo.questionType);
    setTimeLimit(questionInfo.timeLimit);
    setPoints(questionInfo.points);
    setMediaAttachmentType(questionInfo.mediaAttachmentType);
    setMediaAttachment(questionInfo.mediaAttachment);
    setQuestion(questionInfo.question);
    setAnswers(questionInfo.answers);
  }, []);

  // render image on page load and on file input
  React.useEffect(() => {
    if (mediaAttachment === 'none') {
      setMediaAttachmentDisplay(<>There is currently no image or video attached to this question.</>);
    } else {
      setMediaAttachmentDisplay(
        <MediaDisplay
          mediaType={mediaAttachmentType}
          media={mediaAttachment}
        />
      );
    }
  }, [mediaAttachment]);

  // Handle question type radio state
  const handleQuestionTypeState = (event) => {
    // If changing multi -> single, ensure only 1 correct is ticked
    let nonCorrect = true;
    let changed = false;
    if (event.target.value === 'singleChoice') {
      const tempAnswers = [...answers];
      for (const answer of tempAnswers) {
        if (answer.isCorrect) {
          if (nonCorrect) {
            nonCorrect = false;
          } else {
            changed = true;
            answer.isCorrect = false;
          }
        }
      }
      if (changed) {
        setAnswers(tempAnswers);
      }
    }
    setQuestionType(event.target.value);
  };

  // Handle time limit state
  const handleTimeLimitState = (event) => {
    setTimeLimit(Number(event.target.value));
  }

  // Handle points state
  const handlePointsState = (event) => {
    setPoints(Number(event.target.value));
  }

  // Handle media attachment state for images
  const handleMediaAttachmentStateImage = async (event) => {
    if (event.target.files.length > 0) {
      setMediaAttachmentType('image');
      const image = await fileToDataUrl(event.target.files[0]);
      setMediaAttachment(image);
    } else {
      setMediaAttachmentType('none');
      setMediaAttachment('none');
    }
    setMediaAttachmentError('');
    // Some browsers don't trigger onChange when selecting same file again
    event.target.value = null;
  }

  // Handle media attachment upload url state
  const handleMediaAttachmentUploadURLState = (event) => {
    setMediaAttachmentUploadURL(event.target.value);
  }

  // Removes media attachment upload url state to default
  const deleteMediaAttachmentState = () => {
    setMediaAttachmentType('none');
    setMediaAttachment('none');
  }

  // on upload, grab url input from text field and insert video
  const uploadMediaAttachmentStateURL = () => {
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
      setQuestionEditError({ severity: 'error', text: 'There cannot be more than 6 answers.' });
      return;
    }
    setQuestionEditError('');
    const newAnswer = { content: '', isCorrect: false };
    setAnswers([...answers, newAnswer]);
  }

  // Handle answers isCorrect state
  const handleAnswerIsCorrect = (event, index) => {
    setQuestionEditError('');
    const tempAnswers = [...answers];
    if (questionType === 'singleChoice') {
      for (const answer of tempAnswers) {
        answer.isCorrect = false;
      }
    }
    tempAnswers[index].isCorrect = event.target.checked;
    setAnswers(tempAnswers);
  }

  // Handle answer content state
  const handleAnswerContent = (event, index) => {
    setQuestionEditError('');
    const tempAnswers = [...answers];
    tempAnswers[index].content = event.target.value;
    setAnswers(tempAnswers);
  }

  // Deletes answer
  const deleteAnswer = (index) => {
    if (answers.length <= 2) {
      setQuestionEditError({ severity: 'error', text: 'There must be at least 2 or more answers.' });
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
    const tempQuestions = [...quiz.questions];
    tempQuestions[params.questionId - 1] = updatedQuestion;
    updateQuestions(tempQuestions);
    setQuestionEditError({ severity: 'success', text: 'Changes saved' })
  }

  // Only set new state if update to server is good
  const updateQuestions = async (questions) => {
    const response = await apiCall('admin/quiz/' + params.id, 'PUT', { questions });
    if (response.error) {
      setQuestionEditError({ severity: 'error', text: response.error });
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
      <BackButton />
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
                value={answer.content}
                onChange={e => handleAnswerContent(e, index)}
                startAdornment={
                  <InputAdornment position="start">
                    <Checkbox
                      checked={answer.isCorrect}
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
                      onClick={() => deleteAnswer(index)}
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
        <Alert severity={questionEditError.severity} onClose={() => setQuestionEditError('')}>
          {questionEditError.text}
        </Alert>
      )}

    <Button variant="contained" onClick={handleSubmit}>Save changes</Button>
    </>
  )
}

export default QuestionEdit;
