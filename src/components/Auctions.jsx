import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useAuth0 } from '@auth0/auth0-react';
// import { jwt_decode } from 'jwt-decode';

const Auctions = () => {
  const [auctions, setAuctions] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL ;
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAuctions();
    }
  }, []);

  const fetchAuctions = async () => {
    try {
      const tokenParts = user.sub.split('|');
      const token = tokenParts.length > 1 ? tokenParts[1] : user.sub;
      console.log('Fetching Auctions');
      const response = await axios.get(`${API_URL}/auctions/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
      console.log(response);
      setAuctions(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Subastas publicadas</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {auctions.map((auction) => (
            <div key={auction.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{auction.leagueName} - {auction.round}</h2>
              <p>Resultado: {auction.result}</p>
              <p>Cantidad: {auction.quantity}</p>
              <p>Tipo: {auction.type}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );

};

export default Auctions;