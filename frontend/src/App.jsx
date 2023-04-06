import React from 'react';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';

function App () {
  const [page, setPage] = React.useState('signup')
  return (
    <>
      <header>
        <nav>
          <a href="#" onClick={() => setPage('signup')}>Sign Up</a>
          &nbsp;|&nbsp;
          <a href="#" onClick={() => setPage('signin')}>Sign In</a>
        </nav>
        <hr />
      </header>
      <main>
        {page === 'signup'
          ? <SignUp />
          : page === 'signin'
            ? <SignIn />
            : <Dashboard />
        }
      </main>
    </>
  );
}

export default App;
