import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

function CompletedPurchase() {
  const { getAccessTokenSilently } = useAuth0();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL; 

  const request_id = localStorage.getItem('request_id') || '';
  console.log('Request ID retrieved from localStorage:', request_id);
  const mail = localStorage.getItem('mail') || '';
  console.log('Mail retrieved from localStorage:', mail);

  const token = getAccessTokenSilently();
  useEffect(() => {
    const ws_token = searchParams.get('token_ws') || '';
    const request_i = searchParams.get('request_i') || '';
    console.log(request_i, 'hii')
    if (token) {
      const confirmTransaction = async () => {
        try {
          const response = await axios.post(`${API_URL}/transactions/commit`, {
            ws_token,
            request_id,
            mail
        },{
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
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
