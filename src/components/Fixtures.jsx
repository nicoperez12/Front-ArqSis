import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Fixtures = () => {
  const [fixtures, setFixtures] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchFixtures(currentPage);
  }, [currentPage]);

  const fetchFixtures = async (page) => {
    try {
      // const response = await axios.get(`/api/fixtures?page=${page}&limit=5`);;
      // Hardcoded fixtures for demo purposes
        const response = {
            fixtures: [
                {
                id: 1,
                title: 'Fixture 1',
                description: 'Description for fixture 1',
                },
                {
                id: 2,
                title: 'Fixture 2',
                description: 'Description for fixture 2',
                },
                {
                id: 3,
                title: 'Fixture 3',
                description: 'Description for fixture 3',
                },
                {
                id: 4,
                title: 'Fixture 4',
                description: 'Description for fixture 4',
                },
                {
                id: 5,
                title: 'Fixture 5',
                description: 'Description for fixture 5',
                },
                
            ],
            };

      setFixtures(response.fixtures);
      setHasMore(response.fixtures.length === 5);
    } catch (error) {
      console.error('Error fetching fixtures:', error);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fixtures</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fixtures.map((fixture) => (
          <Link to={`/fixture/${fixture.id}`} key={fixture.id} className="bg-white p-4 rounded shadow hover:bg-gray-100">
            <h2 className="text-xl font-semibold">{fixture.title}</h2>
            <p>{fixture.description}</p>
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
          disabled={!hasMore}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};


export default Fixtures;