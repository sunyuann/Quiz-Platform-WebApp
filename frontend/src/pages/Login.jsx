import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Context, useContext } from '../context';
import { apiCall } from '../helpers';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import OutlinedInput from '@mui/material/OutlinedInput';

function Login () {
  const { getters, setters } = useContext(Context);
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  React.useEffect(() => {
    if (getters.token) {
      navigate('/dashboard')
    }
  })

  async function fetchLogin () {
    const data = await apiCall('admin/auth/login', 'POST', { email, password });
    if (data.error) {
      setError(data.error);
      return;
    }
    setters.setManagedToken(data.token);
    navigate('/dashboard');
  }

  return (
    <>
      <div>
        <InputLabel>Email</InputLabel>
        <TextField
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter Email here'
          sx={{ marginBottom: '10px', width: '40ch' }}
        />
        <InputLabel>Password</InputLabel>
        <OutlinedInput
          type={showPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          sx={{ width: '36ch', marginBottom: '10px' }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Enter Password here'
        />
      </div>
      <Button variant="contained" size='large' onClick={fetchLogin}>Log In</Button>
      { error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}
    </>
  )
}

export default Login;
