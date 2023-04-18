import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, Context } from '../context';
import { apiCall } from '../helpers';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Button from '@mui/material/Button';

function NavBar () {
  const navigate = useNavigate();
  const { getters, setters } = useContext(Context);
  const [navBarLoggedInState, setNavBarLoggedInState] = React.useState(0);

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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Has token */}
          <Box sx={{ width: 500 }}>
            <BottomNavigation
              showLabels
              value={navBarLoggedInState}
              onChange={(event, newState) => {
                setNavBarLoggedInState(newState);
              }}
            >
              <BottomNavigationAction label="Dashboard" component={Link} to='/dashboard'/>
              <BottomNavigationAction label="Join a game!" component={Link} to='/play'/>
            </BottomNavigation>
          </Box>
          <Button onClick={logout} variant="contained">Logout</Button>
        </Box>
          )
        : (
        <>
          {/* No token */}
          <Box sx={{ width: 500 }}>
            <BottomNavigation
              showLabels
              value={navBarLoggedInState}
              onChange={(event, newState) => {
                setNavBarLoggedInState(newState);
              }}
            >
              <BottomNavigationAction label="Sign In" component={Link} to='/login'/>
              <BottomNavigationAction label="Sign Up" component={Link} to='/register'/>
              <BottomNavigationAction label="Join a game" component={Link} to='/play'/>
            </BottomNavigation>
          </Box>
        </>
          )
      }

      <hr />
    </nav>
  )
}

export default NavBar;
