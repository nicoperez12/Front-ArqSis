import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

function CompletedPurchase() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL; 

  useEffect(() => {
    const token = searchParams.get('token_ws') || '';
    if (token) {
      const confirmTransaction = async () => {
        try {
          const response = await axios.post(`${API_URL}/transactions/commit`, {
            ws_token: token,
          });
          setData(response.data); // Guardamos la respuesta del servidor
        } catch (error) {
          console.error("Error en la confirmación de la transacción:", error);
          setError("Hubo un problema al confirmar la transacción. Inténtalo de nuevo más tarde.");
        } finally {
          setIsLoading(false); // Independientemente del resultado, cambiamos el estado de carga
        }
      };
      confirmTransaction();
    } else {
      setError("Token no encontrado en la URL.");
      setIsLoading(false);
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-20 flex justify-center items-center">
        <h1 className="text-2xl font-semibold text-center">Cargando...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 mt-20 flex flex-col gap-5 max-w-md rounded-lg shadow-lg">
      <h1 className="text-center text-2xl font-bold">Compra completada</h1>
      {error ? (
        <p className="text-center text-lg text-red-500">{error}</p>
      ) : (
        <p className="text-center text-lg">{data?.message || "Tu transacción fue exitosa."}</p>
      )}
      <Link to="/" className="bg-green-500 text-white rounded-lg px-5 py-2 hover:bg-green-600 text-center">
        Volver a inicio
      </Link>
    </div>
  );
}

export default CompletedPurchase;
