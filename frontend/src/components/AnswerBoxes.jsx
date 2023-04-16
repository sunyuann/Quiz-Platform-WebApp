import React from 'react';
import AnswerBox from './AnswerBox';
import { styled } from '@mui/system';
import Grid from '@mui/material/Grid';

function AnswerBoxes ({ height, answers, handleClick }) {
  const CustomGrid = styled(Grid)({
    height,
  });

  return (
    <>
      <CustomGrid container spacing={2}>
        {answers.map((answer, index) => (
          <Grid item xs={6} key={index}>
            <AnswerBox index={index} answer={answer} onClick={() => handleClick(index)} />
          </Grid>
        ))}
      </CustomGrid>
    </>
  )
}

export default AnswerBoxes;
