import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState('home');
  const [bots, setBots] = useState([]);
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    category: '',
    phone: '',
    address: '',
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      window.location.href = '/register';
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
        window.location.href = '/register';
      }
    };

    const fetchBots = async () => {
      try {
        const response = await axios.get('http://localhost:8000/chatbot', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBots(response.data);
      } catch (err) {
        console.error('Failed to fetch bots', err);
      }
    };

    const fetchPlans = async () => {
      try {
        const response = await axios.get('http://localhost:8000/plans', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlans(response.data);
      } catch (err) {
        console.error('Failed to fetch plans', err);
      }
    };

    fetchUser();
    fetchBots();
    fetchPlans();
  }, [token]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:8000/umkm/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Profile updated successfully');
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  const handlePlanSelect = async (planId) => {
    try {
      await axios.post('http://localhost:8000/subscriptions', { planId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Subscription successful');
    } catch (err) {
      console.error('Failed to subscribe', err);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '240px', padding: '24px', backgroundColor: '#1e293b', color: 'white' }}>
        <h2 style={{ fontWeight: 'bold' }}>{user ? user.businessName : 'Nama Usaha'}</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li onClick={() => setActivePage('home')} style={{ padding: '10px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.3s', ':hover': { backgroundColor: '#334155' } }}>Beranda</li>
          <li onClick={() => setActivePage('profile')} style={{ padding: '10px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.3s', ':hover': { backgroundColor: '#334155' } }}>Profil Usaha</li>
          <li onClick={() => setActivePage('chatbots')} style={{ padding: '10px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.3s', ':hover': { backgroundColor: '#334155' } }}>Chatbot Saya</li>
          <li onClick={() => setActivePage('plans')} style={{ padding: '10px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.3s', ':hover': { backgroundColor: '#334155' } }}>Paket Langganan</li>
          <li onClick={() => { localStorage.removeItem('token'); window.location.href = '/register'; }} style={{ padding: '10px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.3s', ':hover': { backgroundColor: '#334155' } }}>Keluar</li>
        </ul>
      </div>
      <div style={{ flex: 1, padding: '32px', backgroundColor: '#f8fafc' }}>
        <h1>{activePage === 'home' ? 'Beranda' : activePage === 'profile' ? 'Profil Usaha' : activePage === 'chatbots' ? 'Chatbot Saya' : 'Paket Langganan'}</h1>
        {activePage === 'home' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', width: '30%' }}>
                <h3>Total Bots</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{bots.length}</p>
              </div>
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', width: '30%' }}>
                <h3>Status Langganan</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{user ? user.subscriptionStatus : 'N/A'}</p>
              </div>
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', width: '30%' }}>
                <h3>Paket Aktif</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{user ? user.activePlan : 'N/A'}</p>
              </div>
            </div>
          </>
        )}
        {activePage === 'profile' && (
          <form onSubmit={handleProfileSubmit}>
            <h2>Edit Profil Usaha</h2>
            <input type="text" name="businessName" placeholder="Nama Usaha" onChange={handleFormChange} required />
            <textarea name="description" placeholder="Deskripsi" onChange={handleFormChange} required />
            <input type="text" name="category" placeholder="Kategori" onChange={handleFormChange} required />
            <input type="text" name="phone" placeholder="No HP" onChange={handleFormChange} required />
            <input type="text" name="address" placeholder="Alamat" onChange={handleFormChange} required />
            <button type="submit">Update Profil</button>
          </form>
        )}
        {activePage === 'chatbots' && (
          <>
            <h2>Chatbot Saya</h2>
            <button onClick={() => {/* Logic to open create bot form */}}>Buat Bot Baru</button>
            <ul>
              {bots.map((bot) => (
                <li key={bot.id}>{bot.name}</li>
              ))}
            </ul>
          </>
        )}
        {activePage === 'plans' && (
          <>
            <h2>Paket Langganan</h2>
            <ul>
              {plans.map((plan) => (
                <li key={plan.id}>
                  {plan.name} - {plan.price}
                  <button onClick={() => handlePlanSelect(plan.id)}>Pilih Paket</button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
