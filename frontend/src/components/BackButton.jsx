import React from 'react';
import { useNavigate } from 'react-router-dom';

function BackButton () {
  const navigate = useNavigate();

  // Handle back button
  const handleBack = () => {
    navigate(-1);
  }

  return (
    <>
      <button onClick={handleBack}>Back</button>
    </>
  )
}

export default BackButton;
