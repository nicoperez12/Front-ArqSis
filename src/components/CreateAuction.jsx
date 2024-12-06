import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useAuth0 } from '@auth0/auth0-react';

const CreateAuction = (request, fixture) => {
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
      // console.log('Decoded token', decodedToken);
      console.log('Fetching auctions', user.email);
      // const tokenParts = user.sub.split('|');
      // const token = tokenParts.length > 1 ? tokenParts[1] : user.sub;
      const response = await axios.get(`${API_URL}/auctions/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
      console.log(response);
      setAuctions(response.data);
    } catch (error) {
      console.error('Error fetching auctions:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Crear subasta</h1>
        
      </div>
    </>
  );

}
export default CreateAuction;
