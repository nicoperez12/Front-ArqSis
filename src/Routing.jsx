import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import FixtureDetail from './components/FixtureDetail';
import Wallet from './components/Wallet';
import Requests from './components/Requests';

function Routing() {
  return (
    <Routes>
			<Route path="/" element={<App />} />
			<Route path="/fixture/:id" element={<FixtureDetail />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/requests" element={<Requests />} />
    </Routes>
  );
}

export default Routing;