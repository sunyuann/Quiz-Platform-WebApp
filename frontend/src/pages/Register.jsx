import React from 'react';
import { useContext, Context } from '../context';
import { apiCall } from '../helpers';
import Alert from '@mui/material/Alert';

function Register () {
  const { setters } = useContext(Context);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');

  async function fetchRegister () {
    const data = await apiCall('admin/auth/register', 'POST', { email, password, name });
    if (data.error) {
      setError(data.error);
      return;
    }
    setters.setManagedToken(data.token);
    localStorage.setItem('token', data.token);
  }
  return (
    <>
        Email: <input value={email} onChange={(e) => setEmail(e.target.value)}/><br />
        Password: <input value={password} onChange={(e) => setPassword(e.target.value)}/><br />
        Name: <input value={name} onChange={(e) => setName(e.target.value)}/><br />
        <button onClick={fetchRegister}>Sign Up</button>
        { error && (
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}
    </>
  )
}

export default Register;
