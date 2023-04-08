import React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

function QuestionCard ({ index, handleEdit, handleDelete }) {
  return (
    <>
      <Card sx={{ maxWidth: 500 }}>
        <CardContent>
          Question {index + 1}
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => { handleEdit(index) }}>Edit</Button>
          <Button size="small" onClick={() => { handleDelete(index) }}>Delete</Button>
        </CardActions>
      </Card>
    </>
  )
}

export default QuestionCard;
