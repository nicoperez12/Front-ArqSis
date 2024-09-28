import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { useAuth0 } from '@auth0/auth0-react';

const FixtureDetail = () => {
  const { id } = useParams();
  const [fixture, setFixture] = useState(null);
  const [odds, setOdds] = useState(null);
  const [bonos, setBonos] = useState(0);
  const [amount, setAmount] = useState('');
  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    fetchFixtureDetail();
  }, [id]);

  const fetchFixtureDetail = async () => {
    try {
      // const response = await axios.get(`/api/fixtures/${id}`);
			// Hardcoded fixture for demo purposes
			const response = {
					data: {
							fixture: {
                  id: 1,
                  title: 'Fixture 1',
                  description: 'Description for fixture 1',},

              odds: {
                  home: 1.5,
                  draw: 2.5,
                  away: 3.5,
              },
              bonos: 40
          }
      };

      setFixture(response.data.fixture);
      setOdds(response.data.odds);
      setBonos(response.data.bonos);
    } catch (error) {
      console.error('Error fetching fixture detail:', error);
    }
  };

  const handleBuyBonos = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/fixtures/${id}/buy-bonos`, { amount: parseInt(amount) });
      setBonos(response.data.bonos);
      setAmount('');
    } catch (error) {
      console.error('Error buying bonos:', error);
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
				{/* Detalles de las probabilidades */}
        {odds && (
          <div className="bg-white p-4 rounded shadow mb-4">
            <h2 className="text-xl font-semibold mb-2">Probabilidades</h2>
            <p>Equipo Local: {odds.home}</p>
            <p>Equipo Visitante: {odds.away}</p>
            <p>Empate: {odds.draw}</p>
          </div>
        )}

        {/* Formulario para comprar bonos, solo si está autenticado */}
        
        {isAuthenticated && (<div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="text-xl font-semibold mb-2">Comprar Bonos</h2>
          <p>Bonos Disponibles: {bonos}</p>
          <form onSubmit={handleBuyBonos}>
            <div className="mb-4">
              <label className="block text-gray-700">Cantidad de Bonos</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                placeholder="Ingresa la cantidad"
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              Comprar Bonos
            </button>
          </form>
        </div>)}
			</div>
    </>
    
  );
};

export default FixtureDetail;