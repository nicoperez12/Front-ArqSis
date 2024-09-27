import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const FixtureDetail = () => {
  const { id } = useParams();
  const [fixture, setFixture] = useState(null);

  useEffect(() => {
    fetchFixtureDetail();
  }, [id]);

  const fetchFixtureDetail = async () => {
    try {
      // const response = await axios.get(`/api/fixtures/${id}`);
			// Hardcoded fixture for demo purposes
			const response = {
					data: {
							id: 1,
							title: 'Fixture 1',
							description: 'Description for fixture 1',
					},
			};
      setFixture(response.data);
    } catch (error) {
      console.error('Error fetching fixture detail:', error);
    }
  };

  if (!fixture) {
    return <div>Loading...</div>;
  }

  return (
    <>
			<Navbar/>
			<div className="container mx-auto p-4">
				<h1 className="text-2xl font-bold mb-4">{fixture.title}</h1>
				<p>{fixture.description}</p>
				{/* Agrega más detalles según sea necesario */}
			</div>
    </>
    
  );
};

export default FixtureDetail;