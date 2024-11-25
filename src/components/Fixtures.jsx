import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Fixtures = () => {
  const [fixtures, setFixtures] = useState([]);
  const [filteredFixtures, setFilteredFixtures] = useState([]); // Fixtures filtrados
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [country, setCountry] = useState('');
  const [homeTeam, setHomeTeam] = useState('');
  const [date, setDate] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchFixtures();
  }, []); 

  const fetchFixtures = async () => {
    try {
      const response = await axios.get(`${API_URL}/fixtures`, {
        params: {
          count: 100, // Aumenta el número para obtener más fixtures de una vez
        },
      });

      if (response.data && Array.isArray(response.data.fixtures)) {
        setFixtures(response.data.fixtures); // Almacena todos los fixtures
        setFilteredFixtures(response.data.fixtures); // Inicialmente, muestra todos
      } else {
        console.error('Unexpected response format:', response);
      }
    } catch (error) {
      console.error('Error fetching fixtures:', error);
    }
  };

  return (
    <div>
      {filteredFixtures.map((fixture) => (
        <div key={fixture.id}>
          <Link to={`/fixture/${fixture.id}`}>{fixture.name}</Link>
        </div>
      ))}
    </div>
  );
};

export default Fixtures;
