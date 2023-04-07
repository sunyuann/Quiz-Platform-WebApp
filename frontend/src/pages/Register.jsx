import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext, Context } from '../context';
import { apiCall } from '../helpers';

function Register () {
  const navigate = useNavigate();
  const { setters } = useContext(Context);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');

  async function fetchRegister () {
    const data = await apiCall('admin/auth/register', 'POST', { email, password, name });
    if (data.error) {
      console.log('TODO error registering ', data);
      return;
    }
    setters.setToken(data.token);
    localStorage.setItem('token', data.token);
    navigate('/dashboard');
  }
  return (
    <>
        Email: <input value={email} onChange={(e) => setEmail(e.target.value)}/><br />
        Password: <input value={password} onChange={(e) => setPassword(e.target.value)}/><br />
        Name: <input value={name} onChange={(e) => setName(e.target.value)}/><br />
        <button onClick={fetchRegister}>Sign Up</button>
    </>
  )
}

export default Register;
