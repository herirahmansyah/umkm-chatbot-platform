import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Admin = () => {
  const [stats, setStats] = useState({ total_umkm: 0, total_active: 0, total_inactive: 0 });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUserRole = async () => {
      try {
        const response = await axios.get('http://localhost:8000/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.role !== 'admin') {
          router.push('/dashboard');
        }
      } catch (err) {
        setError('Failed to fetch user role.');
      }
    };

    fetchUserRole();
    fetchStats();
    fetchUsers();
    setIsLoading(false);
  }, [router]);

  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8000/auth/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Stats Response:', response.data);
      setStats(response.data);
    } catch (err) {
      setError('Failed to fetch stats.');
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8000/auth/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Users Response:', response.data);
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users.');
    }
  };

  const toggleUserStatus = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:8000/auth/admin/users/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers(); // Refresh user list
    } catch (err) {
      setError('Failed to toggle user status.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ width: '250px', backgroundColor: '#1f2937', color: 'white', padding: '20px' }}>
        <h2>Admin Panel</h2>
        <ul>
          <li onClick={() => fetchStats()} style={{ cursor: 'pointer', padding: '10px' }}>Statistik</li>
          <li onClick={() => fetchUsers()} style={{ cursor: 'pointer', padding: '10px' }}>Kelola UMKM</li>
          <li onClick={() => { localStorage.removeItem('token'); router.push('/login'); }} style={{ cursor: 'pointer', padding: '10px' }}>Keluar</li>
        </ul>
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        <h2>Statistik</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
          <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <h3>Total UMKM</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total_umkm}</p>
          </div>
          <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <h3>Total Aktif</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total_active}</p>
          </div>
          <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <h3>Total Nonaktif</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total_inactive}</p>
          </div>
        </div>
        <h2>Kelola UMKM</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>No</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td style={{ color: user.is_active ? 'green' : 'red' }}>
                  {user.is_active ? 'Aktif' : 'Nonaktif'}
                </td>
                <td>
                  <button onClick={() => toggleUserStatus(user.id)} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }}>
                    {user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
