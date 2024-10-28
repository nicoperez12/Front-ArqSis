import React, { useEffect, useState } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { useAuth0 } from '@auth0/auth0-react';

const FixtureDetail = () => {
  const { id } = useParams();
  const [fixture, setFixture] = useState(null);
  const [odds, setOdds] = useState(null);
  const navigate = useNavigate();
  const [bonusQuantity, setBonusQuantity] = useState(0);
  const [amount, setAmount] = useState('');
  const [selectedOutcome, setSelectedOutcome] = useState('');
  const { isAuthenticated, user  } = useAuth0();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchFixtureDetail();
  }, [id]);

  const fetchFixtureDetail = async () => {
    try {
      const response = await axios.get(`${API_URL}/fixtures/${id}`);

      if (response.data) {
        setFixture(response.data); // Guarda los detalles del fixture
        setOdds(
          {
            home: response.data.oddsHome,
            draw: response.data.oddsDraw,
            away: response.data.oddsAway,
          }
        ); // Guarda los valores de las odds
        setBonusQuantity(response.data.bonusQuantity); // Guarda la cantidad de bonos
      } else {
        console.error('Fixture no encontrado');
      }
    } catch (error) {
      console.error('Error fetching fixture detail:', error);
    }
  };

  //const handleBuyBonos = async (e) => {
  //  e.preventDefault();
  //  if (isAuthenticated && user) {
  //    try {
  //      const tokenParts = user.sub.split('|');
  //      const token = tokenParts.length > 1 ? tokenParts[1] : user.sub;
  //      console.log(fixture);
  //      const response = await axios.post(`${API_URL}/requests`,
  //        {
  //          group_id: "14", 
  //          fixture_id: id,
  //          league_name: fixture.leagueName,
  //          round: fixture.leagueRound,
  //          date: fixture.fixtureDate,
  //          quantity: parseInt(amount), 
  //          result: selectedOutcome,
  //          deposit_token: token
//
  //        }
  //      );
  //      console.log(response);
  //      setBonusQuantity(bonusQuantity - response.data.quantity); // Actualiza los bonos después de la compra
  //      setAmount('');
  //      setSelectedOutcome('');
  //    } catch (error) {
  //      console.error('Error buying bonos:', error);
  //    }
  //  }
  //};

  const handleRedirect = (e) => {
    e.preventDefault();
    const tokenParts = user.sub.split('|');
    const token = tokenParts.length > 1 ? tokenParts[1] : user.sub;

    const requestData = {
      group_id: "14",
      fixture_id: id, // Asegúrate de que `id` está definido
      league_name: fixture.leagueName,
      round: fixture.leagueRound,
      date: fixture.fixtureDate,
      quantity: parseInt(amount),
      result: selectedOutcome,
      user_token: token, // Asegúrate de que `token` está definido
    };
    
    // Lógica para asegurarte de que el usuario está autenticado
    if (isAuthenticated && user) {
      // Redirige a la ruta de selección de método de pago
      navigate('/choose-payment', { state: requestData });
    } else {
      // Manejo si el usuario no está autenticado (opcional)
      console.error('Usuario no autenticado');
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
          <p><strong>País:</strong> {fixture.leagueCountry}</p>
          <p><strong>Fecha:</strong>  {new Date(fixture.fixtureDate).toLocaleDateString()}</p>
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
            <form onSubmit={handleRedirect}>
              <div className="mb-4">
                <label className="block text-gray-700">Selecciona tu apuesta</label>
                <select
                  value={selectedOutcome}
                  onChange={(e) => setSelectedOutcome(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="" disabled>Selecciona una opción</option>
                  <option value="home">{fixture.homeTeamName}</option>
                  <option value="draw">Empate</option>
                  <option value="away">{fixture.awayTeamName}</option>
                </select>
              </div>

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
              {amount &&
                <div className="font-semibold mb-4">
                <p className="text-gray-700">Costo: {amount ? amount * 1000 : 0} </p>
              </div>}
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
