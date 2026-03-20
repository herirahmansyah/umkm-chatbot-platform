import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/register');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        console.error('Failed to fetch user data', err);
        router.push('/register');
      }
    };

    fetchUser();
  }, [router]);

  return (
    <div className="p-5">
      {user ? (
        <>
          <h1>Welcome to your Dashboard!</h1>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
