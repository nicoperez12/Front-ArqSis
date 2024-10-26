import React from 'react';
import { useLocation } from 'react-router-dom';

function ConfirmPurchase() {
  const location = useLocation();
  const { usr: data } = location.state || {}; // Obtener datos de la ubicación

  console.log(data);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Confirmar Compra</h1>
      <form className="flex flex-col gap-5 border rounded-lg shadow-lg p-6 max-w-md mx-auto" action={data.url} method="POST">
        <input type="hidden" name="token_ws" value={data.token} />
        <div className="flex flex-col gap-2">
          <p>Precio Total: ${data.amount}</p> {/* Asegúrate de que 'data.price' existe */}
        </div>
        <button className="bg-blue-500 text-white rounded-lg px-5 py-2 hover:bg-blue-600" type="submit">
          Pagar ${data.amount}
        </button>
      </form>
    </div>
  );
}

export default ConfirmPurchase;
