import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';

const getColors = (index) => {
  switch (index) {
    case 0:
      return {
        backgroundColor: '#e0163f', // Red
        '&:hover': {
          backgroundColor: '#c0163f',
        }
      };
    case 1:
      return {
        backgroundColor: '#1c69cc', // Blue
        '&:hover': {
          backgroundColor: '#15488a',
        }
      };
    case 2:
      return {
        backgroundColor: '#d79d1f', // Gold
        '&:hover': {
          backgroundColor: '#9c7319',
        }
      };
    case 3:
      return {
        backgroundColor: '#2a8918', // Green
        '&:hover': {
          backgroundColor: '#206a12',
        }
      };
    case 4:
      return {
        backgroundColor: '#189796', // Blue-Green
        '&:hover': {
          backgroundColor: '#126e6d',
        }
      };
    default:
      return {
        backgroundColor: '#864dbd', // Purple
        '&:hover': {
          backgroundColor: '#5f3687',
        }
      };
  }
}

const getShape = (index) => {
  let d = 'M27,24.559972 L5,24.559972 L16,7 L27,24.559972 Z';
  switch (index) {
    case 0:
      d = 'M27,24.559972 L5,24.559972 L16,7 L27,24.559972 Z';
      break;
    case 1:
      d = 'M4,16.0038341 L16,4 L28,16.0007668 L16,28 L4,16.0038341 Z'
      break;
    case 2:
      d = 'M16,27 C9.92486775,27 5,22.0751322 5,16 C5,9.92486775 9.92486775,5 16,5 C22.0751322,5 27,9.92486775 27,16 C27,22.0751322 22.0751322,27 16,27 Z';
      break;
    case 3:
      d = 'M7,7 L25,7 L25,25 L7,25 L7,7 Z';
      break;
    case 4:
      d = 'M8.584 27 4 12.786 16 3.982 28 12.786 23.417 27z';
      break;
    default:
      d = 'M5 8L16 26.857 27 8z'
      break;
  }
  return (<svg width="32" height = "32" viewBox="0 0 32 32" focusable="false" aria-hidden="true">
            <path d={d} fill="white"></path>
          </svg>);
}

function AnswerBox ({ index, answer, onClick }) {
  const StyledBox = styled(Box)(() => {
    const colors = getColors(index);
    return {
      width: '100%',
      height: '100%',
      padding: '5px',
      borderRadius: '5px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...colors,
    };
  });

  return (
    <>
      <StyledBox onClick={onClick}>
        {getShape(index)}
        <Typography variant="h6" color="white">
          {answer}
        </Typography>
      </StyledBox>
    </>
  )
}

export default AnswerBox;
