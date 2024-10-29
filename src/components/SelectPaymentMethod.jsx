import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { PopupCancelledError } from '@auth0/auth0-react';
const API_URL = import.meta.env.VITE_API_URL;

const SelectPaymentMethod = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [error, setError] = useState(null)
  const { group_id, fixture_id, league_name, round, date, quantity, result, user_token } = location.state || {};

  console.log("la quantity es", quantity) 
  // Función para manejar la compra con Wallet
  const handleWalletPurchase = async (e) => {
    e.preventDefault();
    // Lógica para procesar el pago con Wallet o redirigir
    try {
      // const tokenParts = user.sub.split('|');
      // const token = tokenParts.length > 1 ? tokenParts[1] : user.sub;
      const response = await axios.post(`${API_URL}/requests`,
        {
          group_id: group_id, 
          fixture_id: fixture_id,
          league_name: league_name,
          round: round,
          date: date,
          quantity: quantity, 
          result: result,
          user_token: user_token,
          deposit_token: "",
          wallet: true,
        }
      );
      console.log(response);
    } catch (error) {
      console.error('Error fetching fixture detail:', error);
    }
    
    navigate(`/fixture/${fixture_id}`);
  };

  // Función para manejar la compra con Webpay
  const handleWebpayPurchase = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    setError(null); // Reinicia el estado de error

    try {
      // Primera llamada para crear la solicitud y obtener el request_id
      const requestResponse = await axios.post(`${API_URL}/requests`, {
        group_id,
        fixture_id,
        league_name,
        round,
        date,
        quantity,
        result,
        user_token,
        wallet: false,
      });

      console.log(requestResponse.data)

      

      let requestStatus = requestResponse.data.status; // Asumir que la respuesta incluye el estado
      console.log("Estado de la solicitud:", requestStatus);

    // Si el estado es 'pending', buscar el request_id
    if (requestStatus === 'pending') {
      // Aquí puedes hacer una llamada para obtener el request_id de las solicitudes pendientes, 
      // asumiendo que hay un endpoint para eso.
      const request_id = requestResponse.data.request_id; // Asumiendo que la respuesta contiene request_id
      console.log("el request id es", request_id)
      const transactionResponse = await axios.post(`${API_URL}/transactions/create`, {
        request_id: request_id,
        quantity: quantity
      });

      // Suponiendo que la respuesta contiene los datos necesarios para la confirmación
      const { token, url, title, type, amount: transactionAmount } = transactionResponse.data;

      const updateResponseRequest = await axios.patch(`${API_URL}/requests/${request_id}`, {
        deposit_token: token, // Asume que `token` es el nuevo deposit_token
      });

      // Navega al componente de confirmación con los datos necesarios
      navigate('/confirm-webpay-purchase', {
        state: {
          usr: {
            token,
            url,
            title,
            type,
            amount: quantity* 1000,
          },
          request_id,
        },
      });
    }
      // Segunda llamada para crear la transacción usando el request_id
      
    } catch (error) {
      console.error('Error en la compra con Webpay:', error);
      setError('Error al procesar la compra. Intenta nuevamente más tarde.'); // Mensaje de error
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Selecciona el método de pago</h1>
      <form className="flex flex-col gap-5 border rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <p className="text-lg font-semibold text-center">Elige cómo deseas realizar el pago:</p>

        <button
          onClick={handleWalletPurchase}
          className="bg-green-500 text-white rounded-lg px-5 py-2 hover:bg-green-600"
        >
          Comprar con Wallet
        </button>

        <button
          onClick={handleWebpayPurchase}
          className="bg-blue-500 text-white rounded-lg px-5 py-2 hover:bg-blue-600"
        >
          Comprar con Webpay
        </button>
      </form>
    </div>
  );
};

export default SelectPaymentMethod;