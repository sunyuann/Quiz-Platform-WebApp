import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Context, useContext } from '../context';
import { apiCall } from '../helpers';
import Alert from '@mui/material/Alert';

function Register () {
  const { getters, setters } = useContext(Context);
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (getters.token) {
      navigate('/dashboard')
    }
  })

  async function fetchRegister () {
    const data = await apiCall('admin/auth/register', 'POST', { email, password, name });
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
        Name: <input name='name' value={name} onChange={(e) => setName(e.target.value)}/><br />
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
