import Button from '@mui/material/Button';
import { styled } from '@mui/system';

const ButtonFocus = styled(Button)({
  '&:focus': {
    outline: '1px solid black'
  }
})

export default ButtonFocus;
