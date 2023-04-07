import React from 'react';
import { useContext, Context } from '../context';
import { apiCall } from '../helpers';
import Alert from '@mui/material/Alert';

function Login () {
  const { setters } = useContext(Context);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  async function fetchLogin () {
    const data = await apiCall('admin/auth/login', 'POST', { email, password });
    if (data.error) {
      setError(data.error);
      return;
    }
    setters.setManagedToken(data.token);
  }

  return (
    <>
        Email: <input value={email} onChange={(e) => setEmail(e.target.value)}/><br />
        Password: <input value={password} onChange={(e) => setPassword(e.target.value)}/><br />
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
