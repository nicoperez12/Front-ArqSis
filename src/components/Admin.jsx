import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import CreateExchange from './CreateExchange';

const Admin = () => {
  const [admin, setAdmin] = useState(false);
  const [requests, setRequests] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL ;
  const { user, isAuthenticated } = useAuth0();
  const [auctions, setAuctions] = useState([]);
  const [exchanges, setExchanges] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAdmin();
      fetchRequestsAndFixtures();
      fetchAuctions();
      fetchExchanges();
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
      setAdmin(response.data.admin);
    } catch (error) {
      console.error('Error fetching admin:', error);
    }
  };

  const fetchRequestsAndFixtures = async () => {
    try {
      const tokenParts = user.sub.split('|');
      const token = tokenParts.length > 1 ? tokenParts[1] : user.sub;
      console.log('Fetching requests and fixtures', token);
      const response = await axios.get(`${API_URL}/requests/fixtures/${token}`,
      );
      console.log(response);
      setRequests(response.data.requests);
      setFixtures(response.data.fixtures);

    } catch (error) {
      console.error('Error fetching requests and fixtures:', error);
    }
  }

  const fetchAuctions = async () => {
    try {
      const tokenParts = user.sub.split('|');
      const token = tokenParts.length > 1 ? tokenParts[1] : user.sub;
      console.log('Fetching auctions', token);
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
  }

  const fetchExchanges = async () => {
    try {
      const tokenParts = user.sub.split('|');
      const token = tokenParts.length > 1 ? tokenParts[1] : user.sub;
      console.log('Fetching exchanges', token);
      const response = await axios.get(`${API_URL}/proposals/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setExchanges(response.data);

    } catch (error) {
      console.error('Error fetching exchanges:', error);
    }
  }

  const createAuction = async (requestId) => {
    try {
      console.log('Creating auction', requestId);
      const tokenParts = user.sub.split('|');
      const token = tokenParts.length > 1 ? tokenParts[1] : user.sub;
      const response = await axios.post(`${API_URL}/auctions`, {
          request_id: requestId,
          user_token: token,
        }
      );
      console.log(response);
      fetchAuctions();
    } catch (error) {
      console.error('Error creating auction:', error);
    }
  };

  const createExchange = async (requestId) => {
    try {
      console.log('Creating exchange', requestId);
      const tokenParts = user.sub.split('|');
      const token = tokenParts.length > 1 ? tokenParts[1] : user.sub;
      const response = await axios.post(`${API_URL}/proposals`, {
          request_id: requestId,
          user_token: token,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response);
      fetchExchanges();
    } catch (error) {
      console.error('Error creating exchange:', error);
    }
  }

  return (
    <>
      <Navbar />
      {isAuthenticated ? (
        <>
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Subastar o Intercambiar</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {requests.map((request) => (
                <div 
                  key={request.id}
                  className={`bg-white p-4 rounded shadow hover:bg-gray-100 cursor-pointer ${selectedRequest === request.id ? 'bg-blue-100' : ''}`}
                  onClick={() => setSelectedRequest(request.id)}
                >
                  <h2 className="text-xl font-semibold">{request.league_name} - {request.round}</h2>
                  <p>Fecha: {new Date(request.datetime).toLocaleDateString()}</p>
                  <p>Bonos disponibles: {request.quantity}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="container mx-auto p-4">
            <Link to={`/create-auction/${selectedRequest}`}>
              <button
                className={`px-4 py-2 rounded ${selectedRequest ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                disabled={!selectedRequest}
                onClick={() => console.log('Subastar', selectedRequest)}
              >
                Subastar
              </button>
            </Link>
            <Link to={`/create-exchange/${selectedRequest}`}>
              <button
                className={`ml-4 px-4 py-2 rounded ${selectedRequest ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                disabled={!selectedRequest}
                onClick={() => createExchange(selectedRequest)}
              >
                Intercambiar
              </button>
            </Link>
          </div>
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Subastas</h1>
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

          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Intercambios</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exchanges.map((exchange) => (
                <div key={exchange.id} className="bg-white p-4 rounded shadow">
                  <h2 className="text-xl font-semibold">{exchange.leagueName} - {exchange.round}</h2>
                  <p>Resultado: {exchange.result}</p>
                  <p>Cantidad: {exchange.quantity}</p>
                  <p>Tipo: {exchange.type}</p>
                </div>
              ))}
            </div>
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