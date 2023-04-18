import React from 'react';
import AnswerBox from './AnswerBox';
import { styled } from '@mui/system';
import Grid from '@mui/material/Grid';

// correts and disabled are lists of booleans of same length of answers
function AnswerBoxes ({ height, answers, corrects, wrongs, disabled, handleClick }) {
  // Make sure corrects.length >= answers.length
  if (!corrects) corrects = [];
  for (let i = corrects.length; i < answers.length; i++) {
    corrects.push(false);
  }
  if (!wrongs) wrongs = [];
  for (let i = wrongs.length; i < answers.length; i++) {
    wrongs.push(false);
  }
  if (!disabled) disabled = [];
  for (let i = disabled.length; i < answers.length; i++) {
    disabled.push(false);
  }

  const CustomGrid = styled(Grid)({
    height,
  });

  return (
    <>
      <CustomGrid container spacing={2}>
        {answers.map((answer, index) => (
          <Grid item xs={6} key={index}>
            <AnswerBox
              index={index}
              answer={answer}
              correct={corrects[index]}
              wrong={wrongs[index]}
              disabled={disabled[index]}
              onClick={() => handleClick(index)}
            />
          </Grid>
        ))}
      </CustomGrid>
    </>
  )
}

export default AnswerBoxes;
