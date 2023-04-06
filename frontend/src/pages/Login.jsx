import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext, Context } from '../context';
import NavBarNotLoggedIn from '../components/NavBarNotLoggedIn';
import { apiCall } from '../helpers';

function Login () {
  const navigate = useNavigate();
  const { setters } = useContext(Context);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      setters.setToken(localStorage.getItem('token'));
      navigate('/dashboard');
    }
  }, []);

  async function fetchLogin () {
    const data = await apiCall('admin/auth/login', 'POST', { email, password });
    setters.setToken(data.token);
    localStorage.setItem('token', data.token);
    navigate('/dashboard');
  }
  return (
    <>
      <NavBarNotLoggedIn />
        Email: <input value={email} onChange={(e) => setEmail(e.target.value)}/><br />
        Password: <input value={password} onChange={(e) => setPassword(e.target.value)}/><br />
        <button onClick={fetchLogin}>Sign In</button>
    </>
  )
}

export default Login;
