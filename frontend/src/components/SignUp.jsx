import React from 'react';

function SignUp () {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');

  function register () {
    console.log(email, password, name)
  }
  return (
    <>
        Email: <input value={email} onChange={(e) => setEmail(e.target.value)}/><br />
        Password: <input value={password} onChange={(e) => setPassword(e.target.value)}/><br />
        Name: <input value={name} onChange={(e) => setName(e.target.value)}/><br />
        <button onClick={register}>Sign Up</button>
    </>
  )
}

export default SignUp;
