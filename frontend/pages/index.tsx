import React from 'react';
import Link from 'next/link';

const Home = () => {
  return (
    <div>
      <header style={{ backgroundColor: '#1e40af', color: 'white', padding: '80px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>Chatbot AI untuk UMKM Indonesia</h1>
        <p style={{ marginTop: '20px', fontSize: '1.25rem' }}>Solusi cerdas untuk membantu usaha kecil dan menengah Anda dengan teknologi AI.</p>
        <Link href="/register" style={{ marginTop: '30px', display: 'inline-block', backgroundColor: '#2563eb', color: 'white', fontWeight: '600', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none' }}>Daftar Sekarang</Link>
      </header>
      <section style={{ padding: '40px', backgroundColor: '#f8fafc' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px' }}>Fitur Unggulan</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'semibold' }}>Mudah Dipakai</h3>
            <p>Antarmuka yang intuitif dan mudah digunakan untuk semua kalangan.</p>
          </div>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'semibold' }}>AI Pintar</h3>
            <p>Teknologi AI yang canggih untuk memberikan jawaban yang akurat.</p>
          </div>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'semibold' }}>Harga Terjangkau</h3>
            <p>Paket harga yang sesuai dengan kebutuhan usaha Anda.</p>
          </div>
        </div>
      </section>
      <section style={{ padding: '40px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px' }}>Paket Harga</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          <div style={{ backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'semibold' }}>Free</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>Rp0</p>
            <p>Trial 7 Hari</p>
            <ul style={{ marginTop: '16px' }}>
              <li>1 Chatbot</li>
              <li>Layanan CS</li>
              <li>Support Email</li>
            </ul>
          </div>
          <div style={{ backgroundColor: 'white', border: '1px solid #1e40af', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '20px', borderWidth: '2px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'semibold' }}>Pro</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>Rp99.000</p>
            <p>1 Bulan</p>
            <ul style={{ marginTop: '16px' }}>
              <li>1 Chatbot</li>
              <li>Layanan CS</li>
              <li>RAG</li>
              <li>Agenda</li>
              <li>Support 24/7</li>
            </ul>
          </div>
          <div style={{ backgroundColor: 'white', border: '1px solid #6b21a8', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'semibold' }}>Business</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>Rp299.000</p>
            <p>1 Bulan</p>
            <ul style={{ marginTop: '16px' }}>
              <li>1 Chatbot</li>
              <li>Layanan CS</li>
              <li>RAG</li>
              <li>Agenda</li>
              <li>Invoice</li>
              <li>Quotation</li>
              <li>Financial</li>
              <li>Dashboard</li>
              <li>Support Prioritas</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
