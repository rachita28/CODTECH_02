import React, { useState } from 'react';
import { auth } from '../firebase-config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const handle = async (fn) => {
    try {
      setBusy(true);
      await fn();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="wrapper">
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <h2 className="title">Login or Signup</h2>
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <button
          className="button"
          onClick={() => handle(() => signInWithEmailAndPassword(auth, email, password))}
          disabled={busy}
        >
          <span>{busy ? 'Please wait…' : 'Login'}</span>
        </button>

        <button
          className="button"
          onClick={() => handle(() => createUserWithEmailAndPassword(auth, email, password))}
          disabled={busy}
        >
          <span>{busy ? 'Please wait…' : 'Signup'}</span>
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
