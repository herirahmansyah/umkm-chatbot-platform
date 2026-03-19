import React from 'react';
import Link from 'next/link';

const Home = () => {
  return (
    <div>
      <header className="bg-blue-600 text-white p-10 text-center">
        <h1 className="text-4xl font-bold">Chatbot AI untuk UMKM Indonesia</h1>
        <p className="mt-4 text-lg">Solusi cerdas untuk membantu usaha kecil dan menengah Anda dengan teknologi AI.</p>
        <Link href="/register">
          <a className="mt-6 inline-block bg-white text-blue-600 font-semibold py-2 px-4 rounded">Daftar Sekarang</a>
        </Link>
      </header>
      <section className="p-10">
        <h2 className="text-3xl font-bold text-center mb-6">Fitur Unggulan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border p-5 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Mudah Dipakai</h3>
            <p>Antarmuka yang intuitif dan mudah digunakan untuk semua kalangan.</p>
          </div>
          <div className="border p-5 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">AI Pintar</h3>
            <p>Teknologi AI yang canggih untuk memberikan jawaban yang akurat.</p>
          </div>
          <div className="border p-5 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Harga Terjangkau</h3>
            <p>Paket harga yang sesuai dengan kebutuhan usaha Anda.</p>
          </div>
        </div>
      </section>
      <section className="p-10">
        <h2 className="text-3xl font-bold text-center mb-6">Paket Harga</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border p-5 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Free</h3>
            <p className="text-2xl font-bold">Rp0</p>
            <ul className="mt-4">
              <li>1 Chatbot</li>
              <li>Fitur Dasar</li>
              <li>Support Email</li>
            </ul>
          </div>
          <div className="border p-5 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Pro</h3>
            <p className="text-2xl font-bold">Rp99.000</p>
            <ul className="mt-4">
              <li>5 Chatbot</li>
              <li>Fitur Lengkap</li>
              <li>Support 24/7</li>
            </ul>
          </div>
          <div className="border p-5 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Business</h3>
            <p className="text-2xl font-bold">Rp299.000</p>
            <ul className="mt-4">
              <li>Unlimited Chatbot</li>
              <li>Fitur Premium</li>
              <li>Support Prioritas</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
