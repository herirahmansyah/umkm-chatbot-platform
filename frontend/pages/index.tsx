import React from 'react';

const Home = () => {
  return (
    <div>
      <header className="bg-blue-500 text-white p-5">
        <h1 className="text-3xl">Welcome to Our Service</h1>
      </header>
      <section className="p-5">
        <h2 className="text-2xl">Features</h2>
        <ul>
          <li>Feature 1</li>
          <li>Feature 2</li>
          <li>Feature 3</li>
        </ul>
      </section>
      <section className="p-5">
        <h2 className="text-2xl">Pricing</h2>
        <ul>
          <li>Free: Rp0</li>
          <li>Pro: Rp99.000</li>
          <li>Business: Rp299.000</li>
        </ul>
      </section>
    </div>
  );
};

export default Home;
