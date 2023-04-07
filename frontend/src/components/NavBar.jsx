import React from 'react';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useContext, Context } from '../context';
import { apiCall } from '../helpers';

function NavBar () {
  const location = useLocation();
  const navigate = useNavigate();
  const { getters, setters } = useContext(Context);

  // On page refresh, check for localstorage.token
  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      setters.setManagedToken(localStorage.getItem('token'));
    } else {
      // No token, Go Directly to Login, DO NOT PASS GO, DO NOT COLLECT $200
      if (location.pathname !== '/' && location.pathname !== '/login') {
        navigate('/login');
      }
    }
  }, []);

  // When token changes, go to Dashboard or Login page
  React.useEffect(() => {
    if (getters.token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [getters.token])

  async function logout () {
    const response = await apiCall('admin/auth/logout', 'POST');
    if (response.error) {
      console.log('TODO error logging out ', response);
    }
    setters.setManagedToken(null);
  }

  return (
    <nav>
      { getters.token
        ? (
        <>
          {/* Has token */}
          <span><Link to="/dashboard">Dashboard</Link></span>&nbsp;|&nbsp;
          <button onClick={logout}>Logout</button>
        </>
          )
        : (
        <>
          {/* No token */}
          <span><Link to="/register">Sign Up</Link></span>&nbsp;|&nbsp;
          <span><Link to="/login">Sign In</Link></span>&nbsp;|&nbsp;
          <span><Link to="/join">Join a game</Link></span>
        </>
          )
      }
      <hr />
    </nav>
  )
}

export default NavBar;
