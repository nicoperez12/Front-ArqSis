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

  useEffect(() => {
    fetchFixtures();
  }, []); 

  const fetchFixtures = async () => {
    try {
      const response = await axios.get('http://localhost:3000/fixtures', {
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

  const applyFilters = () => {
    let filtered = fixtures;

    // Filtra por país (leagueCountry)
    if (country) {
      filtered = filtered.filter(fixture => 
        fixture.leagueCountry.toLowerCase().includes(country.toLowerCase())
      );
    }

    // Filtra por equipo local (homeTeam)
    if (homeTeam) {
      filtered = filtered.filter(fixture => 
        fixture.homeTeamName.toLowerCase().includes(homeTeam.toLowerCase())
      );
    }

    // Filtra por fecha (fixtureDate)
    if (date) {
      filtered = filtered.filter(fixture => {
        const fixtureDate = new Date(fixture.fixtureDate).toISOString().split('T')[0];
        return fixtureDate === date;
      });
    }

    // Actualiza los fixtures filtrados
    setFilteredFixtures(filtered);
    setHasMore(filtered.length > 0);
    setCurrentPage(1); // Reinicia la paginación
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const fixturesPerPage = 6;
    const maxPage = Math.ceil(filteredFixtures.length / fixturesPerPage);
    if (currentPage < maxPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFilterChange = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const fixturesPerPage = 6;
  const displayedFixtures = filteredFixtures.slice(
    (currentPage - 1) * fixturesPerPage,
    currentPage * fixturesPerPage
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fixtures</h1>
      <form onSubmit={handleFilterChange} className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700">País</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Ingresa el país"
            />
          </div>
          <div>
            <label className="block text-gray-700">Equipo Local</label>
            <input
              type="text"
              value={homeTeam}
              onChange={(e) => setHomeTeam(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Ingresa el equipo local"
            />
          </div>
          <div>
            <label className="block text-gray-700">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
        <button type="submit" className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Filtrar
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedFixtures.map((fixture) => (
          <Link to={`/fixture/${fixture.fixtureId}`} key={fixture.fixtureId} className="bg-white p-4 rounded shadow hover:bg-gray-100">
            <h2 className="text-xl font-semibold">{fixture.homeTeamName} vs {fixture.awayTeamName}</h2>
            <p>Liga: {fixture.leagueName}</p>
            <p>Fecha: {new Date(fixture.fixtureDate).toLocaleDateString()}</p>
          </Link>
        ))}
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span>Página {currentPage}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage * fixturesPerPage >= filteredFixtures.length}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Fixtures;
