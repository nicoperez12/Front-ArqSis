import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { useAuth0 } from '@auth0/auth0-react';

const FixtureDetail = () => {
  const { id } = useParams();
  const [fixture, setFixture] = useState(null);
  const [odds, setOdds] = useState(null);
  const [bonusQuantity, setBonusQuantity] = useState(0);
  const [amount, setAmount] = useState('');
  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    fetchFixtureDetail();
  }, [id]);

  const fetchFixtureDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/fixtures/${id}`);

      if (response.data) {
        setFixture(response.data); // Guarda los detalles del fixture
        setOdds(response.data.oddsValues); // Guarda los valores de las odds
        setBonusQuantity(response.data.bonusQuantity); // Guarda la cantidad de bonos
      } else {
        console.error('Fixture no encontrado');
      }
    } catch (error) {
      console.error('Error fetching fixture detail:', error);
    }
  };

  const handleBuyBonos = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/fixtures/${id}/buy-bonos`, { amount: parseInt(amount) });
      setBonusQuantity(response.data.bonusQuantity); // Actualiza los bonos después de la compra
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
        <h1 className="text-2xl font-bold mb-4">Detalles del Partido</h1>
        
        {/* Detalles del equipo local, visitante y liga */}
        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="text-xl font-semibold mb-2">Partido</h2>
          <p><strong>Equipo Local:</strong> {fixture.homeTeamName}</p>
          <p><strong>Equipo Visitante:</strong> {fixture.awayTeamName}</p>
          <p><strong>Liga:</strong> {fixture.leagueName}</p>
        </div>

        {/* Detalles de las probabilidades */}
        {odds && (
          <div className="bg-white p-4 rounded shadow mb-4">
            <h2 className="text-xl font-semibold mb-2">Probabilidades</h2>
            <p><strong>Equipo Local:</strong> {odds.home}</p>
            <p><strong>Empate:</strong> {odds.draw}</p>
            <p><strong>Equipo Visitante:</strong> {odds.away}</p>
          </div>
        )}

        {/* Mostrar la cantidad de bonos */}
        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="text-xl font-semibold mb-2">Bonos Disponibles</h2>
          <p><strong>Bonos:</strong> {bonusQuantity}</p>
        </div>

        {/* Formulario para comprar bonos, solo si está autenticado */}
        {isAuthenticated && (
          <div className="bg-white p-4 rounded shadow mb-4">
            <h2 className="text-xl font-semibold mb-2">Comprar Bonos</h2>
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
          </div>
        )}
      </div>
    </>
  );
};

export default FixtureDetail;
