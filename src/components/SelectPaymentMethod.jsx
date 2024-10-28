
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { PopupCancelledError } from '@auth0/auth0-react';

const SelectPaymentMethod = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [error, setError] = useState(null)
  const { group_id, fixture_id, league_name, round, date, quantity, result, user_token } = location.state || {};

  console.log("la quantity es", quantity) 
  // Función para manejar la compra con Wallet
  const handleWalletPurchase = (e) => {
    e.preventDefault();
    // Lógica para procesar el pago con Wallet o redirigir
    navigate('/wallet-purchase');
  };

  // Función para manejar la compra con Webpay
  const handleWebpayPurchase = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    setError(null); // Reinicia el estado de error

    console.log('en handle web pay')

    try {
      // Primera llamada para crear la solicitud y obtener el request_id
      const requestResponse = await axios.post('http://localhost:3000/requests', {
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

      console.log('current request', requestResponse.data)

      

      let requestStatus = requestResponse.data.status; // Asumir que la respuesta incluye el estado
      console.log("Estado de la solicitud:", requestStatus);

    // Si el estado es 'pending', buscar el request_id
    if (requestStatus === 'pending') {
      // Aquí puedes hacer una llamada para obtener el request_id de las solicitudes pendientes, 
      // asumiendo que hay un endpoint para eso.
      const request_id = requestResponse.data.request_id; // Asumiendo que la respuesta contiene request_id
      console.log("el request id es", request_id)
      const transactionResponse = await axios.post('http://localhost:3000/transactions/create', {
        request_id: request_id,
        quantity: quantity
      });
      console.log("hi",request_id)

      // Suponiendo que la respuesta contiene los datos necesarios para la confirmación
      const { token, url, title, type, amount: transactionAmount } = transactionResponse.data;

      const updateResponseRequest = await axios.patch(`http://localhost:3000/requests/${request_id}`, {
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