import React from 'react';
import { useNavigate } from 'react-router-dom';

const SelectPaymentMethod = () => {
  const navigate = useNavigate();

  // Función para manejar la compra con Wallet
  const handleWalletPurchase = (e) => {
    e.preventDefault();
    // Lógica para procesar el pago con Wallet o redirigir
    navigate('/wallet-purchase');
  };

  // Función para manejar la compra con Webpay
  const handleWebpayPurchase = (e) => {
    e.preventDefault();
    // Lógica para procesar el pago con Webpay o redirigir
    navigate('/webpay-purchase');
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