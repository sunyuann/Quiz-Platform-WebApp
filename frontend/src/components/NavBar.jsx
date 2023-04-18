import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, Context } from '../context';
import { apiCall } from '../helpers';

function NavBar () {
  const navigate = useNavigate();
  const { getters, setters } = useContext(Context);

  async function logout () {
    const response = await apiCall('admin/auth/logout', 'POST');
    if (response.error) {
      // Token was invalid, don't really care
      console.log(response.error);
    }
    setters.setManagedToken(null);
    navigate('/login');
  }

  return (
    <nav>
      { getters.token
        ? (
        <>
          {/* Has token */}
          <span><Link to="/dashboard">Dashboard</Link></span>&nbsp;|&nbsp;
          <span><Link to="/play">Join a game</Link></span> &nbsp;
          <button onClick={logout}>Logout</button>
        </>
          )
        : (
        <>
          {/* No token */}
          <span><Link to="/register">Sign Up</Link></span>&nbsp;|&nbsp;
          <span><Link to="/login">Sign In</Link></span>&nbsp;|&nbsp;
          <span><Link to="/play">Join a game</Link></span>
        </>
          )
      }
      <hr />
    </nav>
  )
}

export default NavBar;
