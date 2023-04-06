import React from 'react';

function SignUp ({ onSuccess }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');

  async function register () {
    const response = await fetch('http://localhost:5005/admin/auth/register', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name,
      })
    });
    const data = await response.json();
    onSuccess(data.token);
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
