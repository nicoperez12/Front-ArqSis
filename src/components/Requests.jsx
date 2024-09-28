import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const Requests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      // const response = await axios.get('/api/requests');
      // Hardcoded requests for demo purposes
      const response = {
        requests: [
          {
            id: 1,
            title: 'Solicitud 1',
            odds: 1.5,
            bonos: 2,
            ganancia: 3000,
            status: 'Pendiente',
          },
          {
            id: 2,
            title: 'Solicitud 2',
            odds: 2.5,
            bonos: 3,
            ganancia: 7500,
            status: 'Pendiente',
          },
          {
            id: 3,
            title: 'Solicitud 3',
            odds: 3.5,
            bonos: 4,
            ganancia: 14000,
            status: 'Aprobada',
          },
        ],
      };

      setRequests(response.requests);
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
              <h2 className="text-xl font-semibold">{request.title}</h2>
              <p>Estado: {request.status}</p>
              <p>Probabilidades: {request.odds}</p>
              <p>Bonos: {request.bonos}</p>
              <p>Ganancia: {request.ganancia}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );

};

export default Requests;