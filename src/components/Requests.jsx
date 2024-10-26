import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useAuth0 } from '@auth0/auth0-react';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL ;
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchRequests();
    }
  }, []);

  const fetchRequests = async () => {
    try {
      console.log('Fetching requests', user.email);
      const tokenParts = user.sub.split('|');
      const token = tokenParts.length > 1 ? tokenParts[1] : user.sub;
        const response = await axios.get(`${API_URL}/requests`, {
          params: {
            user_token: token,
          }
        }
      );
      console.log(response);
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Solicitudes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{request.league_name} - {new Date(request.datetime).toLocaleDateString()}</h2>
              {/* <p>Probabilidades: {request.odds}</p> */}
              <p>Bonos comprados: {request.quantity}</p>
              {/* <p>Ganancia: {request.ganancia}</p> */}
              <p>Estado: {request.status}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );

};

export default Requests;