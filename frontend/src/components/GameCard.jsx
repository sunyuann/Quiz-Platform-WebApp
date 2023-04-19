import React from 'react';
import { Link } from 'react-router-dom';
import { apiCall } from '../helpers';
import ExpandMore from './ExpandMore';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

function GameCard ({
  quiz, handleStart, handleEdit, handleDelete, handleJson,
  handleStop, handleControl, handleOldSession
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [jsonAlert, setJsonAlert] = React.useState(null);

  let quizTime = 0;
  for (const question of quiz.questions) {
    quizTime += Number(question.timeLimit);
  }

  // Expand to show old session links
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Handle JSON import
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      const data = JSON.parse(e.target.result);
      const pruned = { name: data.name, questions: data.questions, thumbnail: data.thumbnail }
      const bad = validateData(pruned);
      if (!bad) {
        const response = apiCall(`admin/quiz/${quiz.id}`, 'PUT', pruned);
        if (response.error) {
          setJsonAlert({ severity: 'error', text: 'Error updating Quiz' });
        } else {
          handleJson();
          setJsonAlert({ severity: 'success', text: 'Quiz was updated!' });
        }
      } else {
        setJsonAlert({ severity: 'error', text: `JSON was not valid: ${bad}` });
      }
    };
    event.target.value = null;
  };

  // Returns '' if good, otherwise reason why not good
  const validateData = (data) => {
    if (typeof data.name !== 'string') {
      return 'name was not a string';
    }
    if (!data.thumbnail && !data.thumbnail.includes('data:image')) {
      return 'thumbnail is not a data:image';
    }
    for (const question of data.questions) {
      if (!['singleChoice', 'multipleChoice'].includes(question.questionType)) {
        return 'questionType is wrong';
      }
      if (typeof question.timeLimit !== 'number' || typeof question.points !== 'number') {
        return 'time limit or points is not a number';
      }
      if (typeof question.question !== 'string') {
        return 'question is not a string';
      }
      if (typeof question.mediaAttachmentType === 'string' && typeof question.mediaAttachment !== 'string') {
        return 'mediaAttachment was not a string';
      }
      if (typeof question.mediaAttachmentType !== 'string' && typeof question.mediaAttachment === 'string') {
        return 'mediaAttachmentType was not a string';
      }
      if (question.mediaAttachmentType === 'none' && question.mediaAttachment !== 'none') {
        return 'mediaAttachmentType was "none", but mediaAttachement was not "none"';
      }
      if (question.mediaAttachmentType !== 'none' && question.mediaAttachment === 'none') {
        return 'mediaAttachmentType was not "none", but mediaAttachement was "none"';
      }
      if (question.mediaAttachmentType === 'url' && !question.mediaAttachment.includes('youtube')) {
        return 'mediaAttachmentType was "url", but mediaAttachment was not a youtube video';
      }
      if (question.mediaAttachmentType === 'image' && !question.mediaAttachment.includes('data:image')) {
        return 'mediaAttachmentType was "image", but mediaAttachment was not a data:image';
      }
      if (!question.answers || question.answers.length < 2 || question.answers.length > 6) return false;
      for (const answer of question.answers) {
        if (typeof answer.content !== 'string') {
          return 'answer.content was not a string';
        }
        if (typeof answer.isCorrect !== 'boolean') {
          return 'answer.isCorrect was not a boolean';
        }
      }
    }
    return '';
  };

  return (
    <>
      <Card sx={{ maxWidth: '500px', margin: '5px 5px 5px 0px' }}>
        <CardMedia
          component="div"
          sx={{
            height: 160,
            backgroundSize: 'contain',
            backgroundColor: 'gray',
          }}
          image = { quiz.thumbnail
            ? (
                quiz.thumbnail
              )
            : (
                getDefaultPicture()
              )}
          title= { 'thumbnail of game ' + quiz.name }
        />
        <CardContent>
          <div>
            <Typography variant="h6" gutterBottom>
              <b>Quiz Name: {quiz.name}</b>
            </Typography>
          </div>
          <div>
            <Typography variant="body1" gutterBottom>
              Number of questions: {quiz.questions.length}
            </Typography>
          </div>
          <div>
            <Typography variant="body1" gutterBottom>
              Total time to complete game: {quizTime} seconds
            </Typography>
          </div>
        </CardContent>
        <CardActions>
          {quiz.active
            ? (<>
                <Button variant="contained" onClick={() => { handleStop(quiz.id, quiz.active) }}>Stop</Button>
                <Button variant="contained" onClick={() => { handleControl(quiz.id, quiz.active) }}>Control Panel</Button>
              </>)
            : (<>
                <Button variant="contained" onClick={() => { handleStart(quiz.id) }}>Start</Button>
                <Button variant="contained" onClick={() => { handleEdit(quiz.id) }}>Edit</Button>
                &nbsp;
                <Button
                  variant="contained"
                  component="label"
                >
                  Import
                  <input
                    hidden
                    accept=".json"
                    type="file"
                    placeholder='Upload JSON'
                    onChange={(event) => handleFileChange(event)}
                  />
                </Button>
                <Button variant="contained" onClick={() => { handleDelete(quiz.id) }}>Delete</Button>
              </>)
          }
          <ExpandMore
                  expand={expanded}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            Old sessions:
            { (!quiz.oldSessions || quiz.oldSessions.length === 0)
              ? ' none.'
              : quiz.oldSessions.map((sess, index) => (
              <div key={index}>
              <Link
                to={`/quiz/control/${quiz.id}/${sess}`}
              >
                <span>{sess}</span><span>, </span>
              </Link>
              </div>
              ))
            }
          </CardContent>
        </Collapse>
      </Card>
      { jsonAlert && (
            <Alert severity={jsonAlert.severity} onClose={() => setJsonAlert(null)}>
              {jsonAlert.text}
            </Alert>
      )}
    </>
  )
}

export default GameCard;

const getDefaultPicture = () => {
  return 'data:image/jpeg;base64,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';
};
