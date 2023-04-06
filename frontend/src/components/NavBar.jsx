import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, Context } from '../context';
import { apiCall } from '../helpers';

function NavBar () {
  const navigate = useNavigate();
  const { setters } = useContext(Context);

  async function logout () {
    const response = await apiCall('admin/auth/logout', 'POST');
    if (response.error) {
      console.log('TODO error logging out ', response);
    }
    setters.setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
  }
  return (
    <nav>
      <span><Link to="/dashboard">Dashboard</Link></span>&nbsp;|&nbsp;
      <button onClick={logout}>Logout</button>
      <hr />
    </nav>
  )
}

export default NavBar;
