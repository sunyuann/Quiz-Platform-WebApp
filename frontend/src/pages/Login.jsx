import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Context, useContext } from '../context';
import { apiCall } from '../helpers';
import Alert from '@mui/material/Alert';

function Login () {
  const { getters, setters } = useContext(Context);
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

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
        Email: <input name='email' value={email} onChange={(e) => setEmail(e.target.value)}/><br />
        Password: <input name='password' value={password} onChange={(e) => setPassword(e.target.value)}/><br />
        <button onClick={fetchLogin}>Sign In</button>
        { error && (
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}
    </>
  )
}

export default Login;
