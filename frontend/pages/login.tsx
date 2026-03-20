import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.access_token);
      router.push('/dashboard');
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div style={{ backgroundColor: '#f3f4f6', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', maxWidth: '480px', width: '100%' }}>
        <h2 style={{ marginBottom: '24px' }}>Masuk ke Akun Anda</h2>
        <label>Email</label>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px', width: '100%', marginBottom: '16px' }} />
        <label>Kata Sandi</label>
        <input type="password" placeholder="Kata Sandi" onChange={(e) => setPassword(e.target.value)} style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px', width: '100%', marginBottom: '16px' }} />
        <button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', width: '100%', padding: '12px', borderRadius: '8px', border: 'none' }}>Masuk</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p style={{ marginTop: '16px' }}>Belum punya akun? <a href="/register" style={{ color: '#2563eb' }}>Daftar di sini</a></p>
      </form>
    </div>
  );
};

export default Login;
