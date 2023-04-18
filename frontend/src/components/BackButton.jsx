import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

function BackButton () {
  const navigate = useNavigate();

  // Handle back button
  const handleBack = () => {
    navigate(-1);
  }

  return (
    <>
      <Button variant="contained" onClick={handleBack} >Back</Button>
    </>
  )
}

export default BackButton;
