import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import Routing from './Routing.jsx';
import axios from 'axios';

const DOMAIN = import.meta.env.VITE_DOMAIN_AUTH0 || "dev-ldmj4nnfbyehlbs5.us.auth0.com";
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID_AUTH0 || "LsRzuUa5Ufvms0zj0LlzAPwvuBAQMBgz";
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const API_URL = import.meta.env.VITE_API_URL;


const AuthWrapper = ({ children }) => {
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    console.log('isAuthenticated:', isAuthenticated);
    const createUser = async () => {
      if (isAuthenticated && user) {
        try {
        const tokenParts = user.sub.split('|');
        const token = tokenParts.length > 1 ? tokenParts[1] : user.sub;
        console.log('Token:', token);
        
        // Verifica si el usuario ya existe en la base de datos
        const response = await axios.get(`${API_URL}/users/${token}`);
        console.log('User found:', response.data);
        } catch (error) {
        console.log('Error fetching user:', error.response.data.error);                 
      
        // Si el usuario no existe, crea un nuevo registro
        if (error.response.data.error == "User not found") {
          // Si el error es un 404, el usuario no existe, así que lo creamos
          const tokenParts = user.sub.split('|');
          const token = tokenParts.length > 1 ? tokenParts[1] : user.sub;
          console.log('User not found, creating user:', user);
          await axios.post(`${API_URL}/users`, {
            username: user.email,
            email: user.email,
            user_token: token,
            name: user.name,
            wallet: 0,
            requests: {},
          });
        }
      }
    };
  }

  createUser();
  }, [isAuthenticated, user]);

  return children;
};

const onRedirectCallback = (appState) => {
  window.history.replaceState({}, document.title, appState?.returnTo || window.location.pathname);
};

createRoot(document.getElementById('root')).render(
  <Auth0Provider
      domain={DOMAIN}
      clientId={CLIENT_ID}
      authorizationParams={{
        redirect_uri: REDIRECT_URI
      }}
      onRedirectCallback={onRedirectCallback}
  >
      <AuthWrapper>
        <BrowserRouter>
          <Routing />
        </BrowserRouter>
      </AuthWrapper>
  </Auth0Provider>

)
