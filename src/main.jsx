import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react';
import Routing from './Routing.jsx';

const domain = "dev-ldmj4nnfbyehlbs5.us.auth0.com";
const clientId = "LsRzuUa5Ufvms0zj0LlzAPwvuBAQMBgz";



createRoot(document.getElementById('root')).render(
  <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: "http://localhost:5175"
      }}
  >
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  </Auth0Provider>

)
