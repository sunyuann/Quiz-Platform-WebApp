import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiCall, fileToDataUrl } from '../helpers';
import Alert from '@mui/material/Alert';
import QuestionCard from '../components/QuestionCard';

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
    setName(data.name)
    setThumb(data.thumbnail);
    setQuiz(data)
  }, []);

  // Handle back button
  const handleBack = () => {
    navigate(-1);
  }

  // Handle name state
  const handleNameState = (event) => {
    setName(event.target.value);
  }

  // Handle update name button
  const handleUpdateName = async () => {
    const response = apiCall('admin/quiz/' + params.id, 'PUT', { name })
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
    const response = apiCall('admin/quiz/' + params.id, 'PUT', { thumbnail: thumb })
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
    const questions = [...quiz.questions, JSON.stringify(newQuestion)];
    updateQuestions(questions);
  }

  // Handle Quiz Edit button
  const handleQuestionEdit = (id) => {
    navigate(`/quiz/edit/${params.id}/${id + 1}`);
  }

  // Handle Quiz Delete button
  const handleQuestionDelete = async (id) => {
    const questions = [...quiz.questions];
    questions.splice(id, 1);
    updateQuestions(questions);
  }
  return (
    <>
      <div>
        <button onClick={handleBack}>Back</button>
      </div>
      { quiz && (
        <>
          <div>
          <input type="text" onChange={handleNameState} value={name}/>
          <button onClick={handleUpdateName}>Update Name</button>
          </div>
          { nameAlert && (
            <Alert severity={nameAlert.severity} onClose={() => setNameAlert(null)}>
              {nameAlert.text}
            </Alert>
          )}
          <div>
          <img src={thumb} alt={'Thumbnail of quiz ' + quiz.name} />
          <input
            type="file"
            accept="image/*"
            placeholder="Upload image"
            onChange={handleThumbState}
          />
          <button onClick={handleUpdateThumb}>Update Thumbnail</button>
          </div>
          { thumbAlert && (
            <Alert severity={thumbAlert.severity} onClose={() => setNameAlert(null)}>
              {thumbAlert.text}
            </Alert>
          )}
          Questions:
          <button onClick={handleAddQuestion}>Add new question</button>
          <div>
          {quiz.questions.map((question, index) => (
            <div key={index + 1}>
              <QuestionCard index={index} handleEdit={handleQuestionEdit} handleDelete={handleQuestionDelete} />
            </div>
          ))}
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
