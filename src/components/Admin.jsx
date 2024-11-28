import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useAuth0 } from '@auth0/auth0-react';

const Admin = () => {
  const [admin, setAdmin] = useState(false);
  const [requests, setRequests] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL ;
  const { user, isAuthenticated } = useAuth0();


  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAdmin();
      fetchRequestsAndFixtures();
    }
  }, [isAuthenticated, user]);
  console.log("es admin", admin);
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

  const fetchRequestsAndFixtures = async () => {
    try {
      console.log('Fetching requests and fixtures', user.email);
      const tokenParts = user.sub.split('|');
      const token = tokenParts.length > 1 ? tokenParts[1] : user.sub;
      const response = await axios.get(`${API_URL}/requests`, {
          params: {
            user_token: token,
          }
        }
      );
      console.log(response);
      const fixtureIds = response.data.map((request) => request.fixture_id);

      const fixturesResponse = await axios.get(`${API_URL}/fixtures`, {
          params: {
            user_token: token,
            fixture_ids: fixtureIds,
          }
        }
      );
      console.log(fixturesResponse);

    } catch (error) {
      console.error('Error fetching requests and fixtures:', error);
    }
  }

  return (
    <>
      <Navbar />
      {isAuthenticated ? (
        <>
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Subastar</h1>
          </div>
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Intercambiar</h1>
          </div>
        </>
      ) : (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">No tienes permisos de administrador</h1>
        </div>
      )}
    </>
  );

};

export default Admin;