import React from 'react';
import { Link } from 'react-router-dom';

function NavBarNotLoggedIn () {
  return (
    <nav>
      <span><Link to="/register">Sign Up</Link></span>&nbsp;|&nbsp;
      <span><Link to="/login">Sign In</Link></span>&nbsp;|&nbsp;
      <span><Link to="/join">Join a game</Link></span>
      <hr />
    </nav>
  )
}

export default NavBarNotLoggedIn;
