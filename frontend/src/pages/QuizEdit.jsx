import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiCall, fileToDataUrl } from '../helpers';
import BackButton from '../components/BackButton'
import Alert from '@mui/material/Alert';
import QuestionCard from '../components/QuestionCard';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';

function QuizEdit () {
  const navigate = useNavigate();
  const params = useParams();
  const [name, setName] = React.useState('');
  const [nameAlert, setNameAlert] = React.useState(null);
  const [quiz, setQuiz] = React.useState(null);
  const [quizError, setQuizError] = React.useState('');
  const [thumb, setThumb] = React.useState('');
  const [thumbAlert, setThumbAlert] = React.useState(null);

  // Fetch quiz to edit on first render
  React.useEffect(async () => {
    const data = await apiCall('admin/quiz/' + params.id);
    if (data.error) {
      setQuizError(data.error);
      return;
    }
    setName(data.name);
    setThumb(data.thumbnail);
    setQuiz(data);
  }, []);

  // Handle name state
  const handleNameState = (event) => {
    setName(event.target.value);
  }

  // Handle update name button
  const handleUpdateName = async () => {
    const response = await apiCall('admin/quiz/' + params.id, 'PUT', { name })
    if (response.error) {
      setNameAlert({ severity: 'error', text: response.error });
    } else {
      setNameAlert({ severity: 'success', text: `Quiz name updated to ${name}!` })
    }
  }

  // Handle thumbnail state
  const handleThumbState = async (event) => {
    if (event.target.files.length > 0) {
      const image = await fileToDataUrl(event.target.files[0]);
      setThumb(image);
    } else {
      setThumb(quiz.thumbnail);
    }
  }

  // Handle update thumbnail button
  const handleUpdateThumb = async () => {
    const response = await apiCall('admin/quiz/' + params.id, 'PUT', { thumbnail: thumb })
    if (response.error) {
      setThumbAlert({ severity: 'error', text: response.error });
    } else {
      setThumbAlert({ severity: 'success', text: 'Thumbnail updated' })
    }
  }

  // Only set new state if update to server is good
  const updateQuestions = async (questions) => {
    const response = await apiCall('admin/quiz/' + params.id, 'PUT', { questions });
    if (response.error) {
      setQuizError(response.error);
      return;
    }
    setQuiz((prevState) => {
      return {
        ...prevState,
        questions
      }
    })
  }

  // Handle add question button
  const handleAddQuestion = () => {
    // default question params initialised
    const newQuestion = {
      questionType: 'singleChoice',
      timeLimit: 20,
      points: 10,
      mediaAttachment: 'none',
      mediaAttachmentType: 'none',
      question: 'Sample question: What color is an apple?',
      answers: [
        {
          content: 'Blue',
          isCorrect: false,
        },
        {
          content: 'Red',
          isCorrect: true,
        },
      ],
    };
    const questions = [...quiz.questions, newQuestion];
    updateQuestions(questions);
  }

  // Handle Quiz Edit button
  const handleQuestionEdit = (id) => {
    navigate(`/quiz/edit/${params.id}/${id + 1}`);
  }

  // Handle Quiz Delete button
  const handleQuestionDelete = (id) => {
    const questions = [...quiz.questions];
    questions.splice(id, 1);
    updateQuestions(questions);
  }
  return (
    <>
      <BackButton />
      { quiz && (
        <>
          <Typography variant="h3">
            Quiz Edit Form
          </Typography>
          <br />
          <div style={{ paddingBottom: '15px' }}>
            <InputLabel>Name</InputLabel>
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              value={name}
              onChange={handleNameState}
              sx={{ width: '35ch' }}
            />
            <Button
              variant="contained"
              size="large"
              style={{ paddingTop: '14.5px', paddingBottom: '14.5px', marginLeft: '3px' }}
              onClick={handleUpdateName}
            >
              Update Name
            </Button>
          </div>
          { nameAlert && (
            <Alert severity={nameAlert.severity} onClose={() => setNameAlert(null)}>
              {nameAlert.text}
            </Alert>
          )}
          <div>
            <InputLabel>Thumbnail</InputLabel>
            <img src={thumb} style={{ maxWidth: '55ch', maxHeight: '55ch', height: 'auto' }} alt={'Thumbnail of quiz ' + quiz.name} />
          </div>
          <div>
            <div style={{ marginBottom: '15px', marginTop: '10px' }}>
              <Button
                variant="contained"
                component="label"
                size="large"
                style={{ marginRight: '3px', width: '26ch' }}
              >
                Upload Image
                <input
                  hidden
                  accept="image/*"
                  multiple type="file"
                  placeholder='Upload image'
                  onChange={handleThumbState}
                />
              </Button>
              <Button
                variant="contained"
                size="large"
                style={{ marginLeft: '3px', width: '26ch' }}
                onClick={handleUpdateThumb}
              >
                Update Thumbnail
              </Button>
            </div>
            { thumbAlert && (
            <Alert severity={thumbAlert.severity} onClose={() => setNameAlert(null)}>
              {thumbAlert.text}
            </Alert>
            )}
          </div>
          <div style={{ marginTop: '15px' }}>
            <Typography variant="h5">
              Questions
            </Typography>
            <div style={{ marginTop: '5px', marginLeft: '2px' }}>
              {quiz.questions.map((question, index) => (
                <div key={index + 1}>
                  <QuestionCard index={index} handleEdit={handleQuestionEdit} handleDelete={handleQuestionDelete} />
                </div>
              ))}
              <Button variant="contained" size="large" style={{ marginTop: '6px', marginBottom: '15px' }} onClick={handleAddQuestion}>Add new question</Button>
            </div>
          </div>
        </>
      )}
      { quizError && (
        <Alert severity="error" onClose={() => setQuizError('')}>
          {quizError}
        </Alert>
      )}
    </>
  )
}

export default QuizEdit;
