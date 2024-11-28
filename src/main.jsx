import React, { useEffect } from 'react'
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
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    console.log('isAuthenticated:', isAuthenticated);
    const createUser = async () => {
      if (isAuthenticated && user) {
        let token;
        try {
          token = await getAccessTokenSilently();
          console.log('Token:', token);
          // Verifica si el usuario ya existe en la base de datos
          const response = await axios.get(`${API_URL}/users/${user.sub}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              // 'Content-Type': 'application/json',
            },
          });
          console.log('User found:', response.data);
          const mail = response.data.email;
          localStorage.setItem('mail', mail);
          console.log('Request ID stored in localStorage:', localStorage.getItem('mail'));
        } catch (error) {
          console.error('Error fetching user:', error);
          // Si el usuario no existe, crea un nuevo registro
          if (error.response && error.response.status === 404) {
            try {
              console.log('User not found, creating user:', user);
              await axios.post(`${API_URL}/users`, {
                username: user.email,
                email: user.email,
                user_token: user.sub,
                name: user.name,
                wallet: 0,
                requests: {},
                admin: false,
              }, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  // 'Content-Type': 'application/json',
                },
              });
            } catch (createError) {
              console.error('Error creating user:', createError);
            }
          }
        }
      }
    };

    createUser();
  }, [isAuthenticated, user, getAccessTokenSilently]);

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
        redirect_uri: REDIRECT_URI,
        audience: `https://${DOMAIN}/api/v2/`,
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
