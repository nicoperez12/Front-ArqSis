import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useAuth0 } from '@auth0/auth0-react';

const Admin = () => {
  const [admin, setAdmin] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAdmin();
    }
  }, [isAuthenticated, user]);

  const fetchAdmin = async () => {
    try {
      console.log('Fetching admin', user.email);
      const token = await getAccessTokenSilently();
      console.log("el token es", token);
      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: {
          user_token: user.sub,
        },
      });
      console.log("la response es",response);
      setAdmin(response.data.admin);
    } catch (error) {
      console.error('Error fetching admin:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        
      </div>
    </>
  );

};

export default Admin;