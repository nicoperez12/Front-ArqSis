import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useAuth0 } from '@auth0/auth0-react';

const CreateExchange = (request, fixture) => {
  const [exchanges, setExchanges] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL ;
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchExchanges();
    }
  }, []);

  const fetchExchanges = async () => {
    try {
      const tokenParts = user.sub.split('|');
      const token = tokenParts.length > 1 ? tokenParts[1] : user.sub;
      // console.log('Decoded token', decodedToken);
      console.log('Fetching requests', user.email);
      // const tokenParts = user.sub.split('|');
      // const token = tokenParts.length > 1 ? tokenParts[1] : user.sub;
      const response = await axios.get(`${API_URL}/exchanges/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
      console.log(response);
      setExchanges(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Crear intercambio</h1>
        
      </div>
    </>
  );

}
export default CreateExchange;