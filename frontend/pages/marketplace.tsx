import React, { useState } from 'react';

const Marketplace = () => {
    const [search, setSearch] = useState('');
    
    const products = [
        { title: 'ChatBot CS', emoji: '🤖', description: 'Bot WA layanan pelanggan 24/7', price: 'Rp 99.000/bulan', badge: 'Terlaris' },
        { title: 'AI Marketing', emoji: '📣', description: 'Iklan FB/IG Ads + konten organik harian', price: 'Rp 79.000/bulan' },
        { title: 'AI Agenda', emoji: '📅', description: 'Jadwal broadcast pagi reminder otomatis', price: 'Rp 49.000/bulan' },
        { title: 'AI Keuangan', emoji: '📊', description: 'Catat transaksi dan laporan keuangan', price: 'Rp 69.000/bulan' },
        { title: 'AI Kasir', emoji: '💰', description: 'Kasir digital untuk cafe warung restoran', price: 'Rp 79.000/bulan' },
    ];

    const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(search.toLowerCase()) || 
        product.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <header style={{ backgroundColor: '#1e40af', display: 'flex', justifyContent: 'space-between', padding: '10px 20px' }}>
                <h1 style={{ color: 'white' }}>BangHeri AI Agency</h1>
                <div>
                    <button style={{ border: '1px solid white', color: 'white', background: 'transparent', padding: '10px 20px', marginRight: '10px' }}>Login</button>
                    <button style={{ backgroundColor: 'white', color: '#1e40af', padding: '10px 20px' }}>Daftar</button>
                </div>
            </header>
            <section style={{ backgroundColor: '#eff6ff', textAlign: 'center', padding: '40px 0' }}>
                <h2 style={{ fontSize: '36px' }}>Produk AI untuk UMKM Indonesia</h2>
                <p style={{ fontSize: '18px' }}>Tingkatkan bisnis Anda dengan teknologi AI yang terjangkau</p>
                <input 
                    type="text" 
                    placeholder="Search..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ padding: '10px', width: '50%', borderRadius: '5px', border: '1px solid #ccc' }} 
                />
            </section>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', padding: '20px' }}>
                {filteredProducts.map((product, index) => (
                    <div key={index} style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', padding: '20px', textAlign: 'center', position: 'relative' }}>
                        {product.badge === 'Terlaris' && (
                            <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'green', color: 'white', borderRadius: '20px', padding: '5px 10px' }}>
                                {product.badge}
                            </span>
                        )}
                        <div style={{ fontSize: '48px' }}>{product.emoji}</div>
                        <h3 style={{ fontWeight: 'bold', fontSize: '18px' }}>{product.title}</h3>
                        <p style={{ color: 'gray', fontSize: '14px' }}>{product.description}</p>
                        <p style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '20px' }}>{product.price}</p>
                        <button style={{ backgroundColor: '#2563eb', color: 'white', width: '100%', borderRadius: '8px', padding: '10px' }}>Mulai Sekarang</button>
                    </div>
                ))}
            </div>
            <footer style={{ backgroundColor: '#1e293b', color: 'white', textAlign: 'center', padding: '10px 0' }}>
                <p>© BangHeri AI Agency 2026</p>
            </footer>
        </div>
    );
};

export default Marketplace;
