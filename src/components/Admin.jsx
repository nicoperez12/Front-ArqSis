import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useAuth0 } from '@auth0/auth0-react';

const Admin = () => {
  const [admin, setAdmin] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL ;
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAdmin();
    }
  }, []);

  const fetchAdmin = async () => {
    try {
      console.log('Fetching admin', user.email);
      const tokenParts = user.sub.split('|');
      const token = tokenParts.length > 1 ? tokenParts[1] : user.sub;
      const response = await axios.get(`${API_URL}/users`, {
          params: {
            user_token: token,
          }
        }
      );
      console.log(response);
      setRequests(response.data);
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