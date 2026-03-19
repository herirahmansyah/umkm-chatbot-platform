import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('http://localhost:8000/auth/register', {
      email,
      password,
      businessName,
      category,
      phone,
    });
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="p-5">
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
      <input type="text" placeholder="Business Name" onChange={(e) => setBusinessName(e.target.value)} required />
      <input type="text" placeholder="Category" onChange={(e) => setCategory(e.target.value)} required />
      <input type="text" placeholder="Phone Number" onChange={(e) => setPhone(e.target.value)} required />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
