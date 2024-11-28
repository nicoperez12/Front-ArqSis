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
      // const token = await getAccessTokenSilently();
      // const decodedToken = jwt_decode(token);
      // console.log('Decoded token', decodedToken);
      console.log('Fetching requests', user.email);
      // const tokenParts = user.sub.split('|');
      // const token = tokenParts.length > 1 ? tokenParts[1] : user.sub;
      const response = await axios.get(`${API_URL}/auctions`);
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
        
      </div>
    </>
  );

};

export default Auctions;