import { useState } from 'react'
import './App.css'
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from './components/Navbar';
import Fixtures from './components/Fixtures.jsx';

function App() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  return (
    <div className="App">
      <Navbar />

      <Fixtures />

    </div>
  );
}


export default App
