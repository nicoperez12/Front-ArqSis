import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import FixtureDetail from './components/FixtureDetail';

function Routing() {
  return (
    <Routes>
			<Route path="/" element={<App />} />
			<Route path="/fixture/:id" element={<FixtureDetail />} />
    </Routes>
  );
}

export default Routing;