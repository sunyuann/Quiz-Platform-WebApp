import React from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App () {
  const [page, setPage] = React.useState('signup');
  const [token, setToken] = React.useState(null);

  function manageTokenSet (token) {
    setToken(token);
    localStorage.setItem('token', token);
  }

  // todo: abstract into logout function and use logout fetch method
  function logout () {
    setToken(null);
    localStorage.removeItem('token');
  }

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  return (
    <>
      <header>
        <nav>
          {token
            ? <>
                <a href="#" onClick={logout}>Logout</a>
              </>
            : <>
                <a href="#" onClick={() => setPage('signup')}>Sign Up</a>
                &nbsp;|&nbsp;
                <a href="#" onClick={() => setPage('signin')}>Sign In</a>
              </>
          }
        </nav>
        <hr />
      </header>
      <main>
        {token !== null
          ? <Dashboard token={token}/>
          : page === 'signup'
            ? <Register onSuccess={manageTokenSet}/>
            : page === 'signin'
              ? <Login onSuccess={manageTokenSet}/>
              : <>BLANK</>
        }
      </main>
    </>
  );
}

export default App;
