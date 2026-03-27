import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState('home');
  const [bots, setBots] = useState([]);
  const [plans, setPlans] = useState([]);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    category: '',
    phone: '',
    address: '',
  });
  const [botFormVisible, setBotFormVisible] = useState(false);
  const [newBotData, setNewBotData] = useState({
    botName: '',
    systemPrompt: '',
  });
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

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

    const loadSubscription = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get('http://localhost:8000/subscriptions/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('Subscription data:', response.data);
          setActiveSubscription(response.data);
        } catch (err) {
          console.error('Failed to load subscription', err);
        }
      }
    };

    fetchUser();
    fetchBots();
    fetchPlans();
    loadSubscription();
  }, [token, isLoading]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBotFormChange = (e) => {
    setNewBotData({ ...newBotData, [e.target.name]: e.target.value });
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

  const handlePlanSelect = async (planId, planName) => {
    const startDate = new Date().toISOString().split('T')[0];
    let endDate;

    if (planName === 'Free') {
      endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);
    } else {
      endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
    }

    const endDateString = endDate.toISOString().split('T')[0];

    try {
      await axios.post('http://localhost:8000/subscriptions', { plan_id: planId, mulai: startDate, selesai: endDateString }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(`Berhasil berlangganan paket ${planName}!`);
      fetchSubscription(); // Refresh the subscription status
    } catch (err) {
      console.error('Failed to subscribe', err);
    }
  };

  const handleCreateBot = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    console.log('Token:', token);
    try {
      console.log('New Bot Data:', newBotData);
      const response = await axios.post('http://localhost:8000/chatbot', {
        nama: newBotData.botName,
        system_prompt: newBotData.systemPrompt,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Response:', response);
      alert('Bot created successfully');
      setBotFormVisible(false);
      setNewBotData({ botName: '', systemPrompt: '' });
      // Refresh the bot list
      const botResponse = await axios.get('http://localhost:8000/chatbot', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBots(botResponse.data);
    } catch (err) {
      console.error('Failed to create bot', err);
    }
  };

  const formatPrice = (price) => {
    return price > 0 ? `Rp. ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}` : 'Gratis';
  };

  const copyToClipboard = (url, index) => {
    navigator.clipboard.writeText(url).then(() => {
      const copyButton = document.getElementById(`copy-button-${index}`);
      copyButton.innerText = 'Copied!';
      setTimeout(() => {
        copyButton.innerText = 'Copy';
      }, 2000);
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
          <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px' }}>
            <h2>Edit Profil Usaha</h2>
            <label>Nama Usaha</label>
            <input type="text" name="businessName" placeholder="Nama Usaha" onChange={handleFormChange} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', marginBottom: '16px' }} />
            <label>Deskripsi</label>
            <textarea name="description" placeholder="Deskripsi" onChange={handleFormChange} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', marginBottom: '16px' }} />
            <label>Kategori</label>
            <input type="text" name="category" placeholder="Kategori" onChange={handleFormChange} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', marginBottom: '16px' }} />
            <label>No HP</label>
            <input type="text" name="phone" placeholder="No HP" onChange={handleFormChange} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', marginBottom: '16px' }} />
            <label>Alamat</label>
            <input type="text" name="address" placeholder="Alamat" onChange={handleFormChange} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', marginBottom: '16px' }} />
            <button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', width: '100%', maxWidth: '500px', padding: '10px', borderRadius: '8px', border: 'none' }}>Update Profil</button>
          </form>
        )}
        {activePage === 'chatbots' && (
          <>
            <h2>Chatbot Saya</h2>
            <button onClick={() => setBotFormVisible(true)} style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '8px' }}>Buat Bot Baru</button>
            {botFormVisible && (
              <div style={{ marginTop: '20px', maxWidth: '500px' }}>
                <h3>Buat Bot</h3>
                <label>Nama Bot</label>
                <input type="text" name="botName" placeholder="Nama Bot" onChange={handleBotFormChange} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', marginBottom: '16px' }} />
                <label>System Prompt</label>
                <textarea name="systemPrompt" placeholder="System Prompt" onChange={handleBotFormChange} style={{ width: '100%', height: '120px', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', marginBottom: '16px' }} />
                <button onClick={handleCreateBot} style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '8px', marginRight: '10px' }}>Simpan Bot</button>
                <button onClick={() => setBotFormVisible(false)} style={{ backgroundColor: '#d1d5db', color: 'black', padding: '10px 20px', borderRadius: '8px' }}>Batal</button>
              </div>
            )}
            {bots.length === 0 ? (
              <p style={{ textAlign: 'center', marginTop: '20px' }}>Belum ada chatbot. Buat bot pertama Anda!</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
                {bots.map((bot, index) => (
                  <div key={bot.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', width: 'calc(33% - 20px)' }}>
                    <h4 style={{ fontWeight: 'bold' }}>{bot.nama}</h4>
                    <p style={{ color: bot.is_active ? 'green' : 'red' }}>
                      {bot.is_active ? 'Aktif' : 'Nonaktif'}
                    </p>
                    <label>Webhook URL:</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="text"
                        readOnly
                        value={`http://localhost:8000/webhook/whatsapp/${bot.id}`}
                        style={{ flex: 1, padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', marginRight: '10px' }}
                      />
                      <button id={`copy-button-${index}`} onClick={() => copyToClipboard(`http://localhost:8000/webhook/whatsapp/${bot.id}`, index)} style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px', borderRadius: '8px' }}>Copy</button>
                    </div>
                    <button style={{ backgroundColor: '#2563eb', color: 'white', padding: '5px 10px', borderRadius: '8px' }}>Edit</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {activePage === 'plans' && (
          <>
            <h2>Paket Langganan</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {plans.map((plan) => {
                const duration = plan.fitur[0]; // Get the first feature as duration
                const features = plan.fitur.slice(1); // Remove the first feature from the list
                const isActive = activeSubscription && activeSubscription.plan_id === plan.id; // Check if this plan is active
                return (
                  <div key={plan.id} style={{ backgroundColor: isActive ? '#d1fae5' : (plan.nama === 'Business' ? '#eff6ff' : 'white'), border: plan.nama === 'Business' ? '1px solid #2563eb' : 'none', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    <h3 style={{ fontWeight: 'bold', fontSize: '20px' }}>{plan.nama}</h3>
                    <p>{formatPrice(plan.harga)}</p>
                    <p>{duration}</p>
                    {features.length > 0 && (
                      <ul>
                        {features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    )}
                    {isActive ? (
                      <button disabled style={{ backgroundColor: 'green', color: 'white', width: '100%', padding: '10px', borderRadius: '8px', border: 'none' }}>Paket Aktif</button>
                    ) : (
                      <button onClick={() => handlePlanSelect(plan.id, plan.nama)} style={{ backgroundColor: '#2563eb', color: 'white', width: '100%', padding: '10px', borderRadius: '8px', border: 'none' }}>Pilih Paket</button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
