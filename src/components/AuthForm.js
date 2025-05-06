import React, { useState } from 'react';
import api from '../api';

export default function AuthForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const endpoint = mode === 'login' ? 'login' : 'register';
      const res = await api.post(`/auth/${endpoint}`, { email, password });
      onLogin(res.data.user);
    } catch (err) {
      alert('Error: ' + err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <h2>{mode === 'login' ? 'Log In' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">{mode === 'login' ? 'Log In' : 'Register'}</button>
      </form>
      <p onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ cursor: 'pointer', color: 'blue' }}>
        {mode === 'login' ? 'Need an account? Register' : 'Have an account? Log In'}
      </p>
    </div>
  );
}
