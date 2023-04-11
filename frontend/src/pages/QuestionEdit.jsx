import React from 'react';
import { useNavigate } from 'react-router-dom';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

function QuestionEdit () {
  const navigate = useNavigate();
  const [value, setValue] = React.useState('female');

  // Handle back button
  const handleBack = () => {
    navigate(-1);
  }

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <>
      <button onClick={handleBack}>Back</button>
      {/* TODO: next question and previous question edit button? */}
      <div>
        <FormControl>
        <FormLabel id="demo-controlled-radio-buttons-group">Question Type</FormLabel>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={value}
          onChange={handleChange}
        >
          <FormControlLabel value="singleChoice" control={<Radio />} label="Single Choice Question" />
          <FormControlLabel value="multipleChoice" control={<Radio />} label="Multiple Choice Question" />
        </RadioGroup>
      </FormControl>
    </div>
    </>
  )
}

export default QuestionEdit;
