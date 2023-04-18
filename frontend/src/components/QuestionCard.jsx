import React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';

function QuestionCard ({ index, handleEdit, handleDelete }) {
  return (
    <>
      <Card sx={{ maxWidth: '500' }} variant="outlined">
        <Typography variant="body1" sx={{ margin: '20px 0px 0px 20px' }}>
          Question {index + 1}
        </Typography>
        <CardActions>
          <Button onClick={() => { handleEdit(index) }}>Edit</Button>
          <Button onClick={() => { handleDelete(index) }}>Delete</Button>
        </CardActions>
      </Card>
    </>
  )
}

export default QuestionCard;
