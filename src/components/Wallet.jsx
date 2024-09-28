import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      // const response = await axios.get('/api/wallet/balance');
      const response = {
        balance: 100,
      };
      setBalance(response.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleAddMoney = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/wallet/add', { amount: parseFloat(amount) });
      setBalance(response.balance);
      setAmount('');
    } catch (error) {
      console.error('Error adding money:', error);
    }
  };

  return (
    <>
      <Navbar/>
      <div className="container mx-auto p-4 flex justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Mi Billetera</h1>
        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="text-xl font-semibold">Saldo Actual: ${balance}</h2>
        </div>
        <form onSubmit={handleAddMoney} className="bg-white p-4 rounded shadow">
          <div className="mb-4">
            <label className="block text-gray-700">Cantidad a Agregar</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Ingresa la cantidad"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Agregar Dinero
          </button>
        </form>
        </div>
      </div>
    </>
  );
};

export default Wallet;