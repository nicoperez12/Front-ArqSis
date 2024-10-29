import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

const Recommendation = () => {
  const [recommendations, setRecommendations] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL ;
  const { user, isAuthenticated } = useAuth0();
  const [workersActive, setWorkersActive] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchRecommendations();
      fetchWorkersActive();
    }
  }, []);

  const fetchRecommendations = async () => {
    try {
      console.log('Fetching recommendations', user.email);
      const tokenParts = user.sub.split('|');
      const token = tokenParts.length > 1 ? tokenParts[1] : user.sub;
      const response = await axios.get(`${API_URL}/recommendations`, {
        params: {
          username: token,
        }
      }
      );
      console.log(response);
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  }

  const fetchWorkersActive = async () => {
    try {
      const response = await axios.get(`${API_URL}/recommendations/heartbeat`);
      console.log(response);
      if (response.data) {
        setWorkersActive(response.data);
      }
    }
    catch (error) {
      console.error('Error fetching workers:', error);
    }
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">

      <h1 className="text-2xl font-bold mb-4">
          Estado de los workers:
          <button
            onClick={fetchWorkersActive}
            className={`ml-2 px-4 py-2 rounded ${
              workersActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {workersActive ? 'Activos' : 'Inactivos'}
          </button>
        </h1>
        
        <h1 className="text-2xl font-bold mb-4">Recomendaciones</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((recommendation) => (
            <Link to={`/fixture/${recommendation.id}`} key={recommendation.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{recommendation.homeTeamName} vs {recommendation.awayTeamName}</h2>
              <p>Liga: {recommendation.leagueName}</p>
              <p>País: {recommendation.leagueCountry}</p>
              <p>Fecha: {new Date(recommendation.fixtureDate).toLocaleDateString()}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Recommendation;