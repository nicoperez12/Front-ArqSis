import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

const Admin = () => {
  const [admin, setAdmin] = useState(false);
  const [requests, setRequests] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [selectedFixture, setSelectedFixture] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL ;
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [auctions, setAuctions] = useState([]);
  const [exchanges, setExchanges] = useState([]);


  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAdmin();
      fetchRequestsAndFixtures();
      fetchAuctions();
      fetchExchanges();
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
      const token = await getAccessTokenSilently();
      console.log('Fetching requests and fixtures', token);
      const response = await axios.get(`${API_URL}/requests/fixtures/${token}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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
      const token = await getAccessTokenSilently();
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
      const token = getAccessTokenSilently();
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

  return (
    <>
      <Navbar />
      {isAuthenticated ? (
        <>
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Subastar o Intercambiar</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fixtures.map((fixture) => (
                <div
                  key={fixture.fixtureId}
                  className={`bg-white p-4 rounded shadow hover:bg-gray-100 cursor-pointer ${selectedFixture === fixture.fixtureId ? 'bg-blue-100' : ''}`}
                  onClick={() => setSelectedFixture(fixture.fixtureId)}
                >
                  <h2 className="text-xl font-semibold">{fixture.homeTeamName} vs {fixture.awayTeamName}</h2>
                  <p>Liga: {fixture.leagueName}</p>
                  <p>País: {fixture.leagueCountry}</p>
                  <p>Fecha: {new Date(fixture.fixtureDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="container mx-auto p-4">
            <Link to={`/create-auction/${selectedFixture}`}>
              <button
                className={`px-4 py-2 rounded ${selectedFixture ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                disabled={!selectedFixture}
                onClick={() => console.log('Subastar', selectedFixture)}
              >
                Subastar
              </button>
            </Link>
            <Link to={`/create-exchange/${selectedFixture}`}>
              <button
                className={`ml-4 px-4 py-2 rounded ${selectedFixture ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                disabled={!selectedFixture}
                onClick={() => console.log('Intercambiar', selectedFixture)}
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