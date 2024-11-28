import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import FixtureDetail from './components/FixtureDetail';
import Wallet from './components/Wallet';
import Requests from './components/Requests';
import SelectPaymentMethod from './components/SelectPaymentMethod';
import ConfirmPurchase from './components/ConfirmPurchase';
import CompletedPurchase from './components/CompletedPurchase';
import Recommendation from './components/Recommendation';
import Admin from './components/Admin';
import Auctions from './components/Auctions';
import Bid from './components/Bid';
import CreateExchange from './components/CreateExchange';
import CreateAuction from './components/CreateAuction';

function Routing() {
  return (
    <Routes>
			<Route path="/" element={<App />} />
			<Route path="/fixture/:id" element={<FixtureDetail />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/requests" element={<Requests />} />
      <Route path="/choose-payment" element={<SelectPaymentMethod />}/>
      <Route path="/confirm-webpay-purchase" element={<ConfirmPurchase />} />
      <Route path="/completed-purchase" element={<CompletedPurchase />} />
      <Route path="/recommendations" element={<Recommendation />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/auctions" element={<Auctions />} />
      <Route path="/bid/:id" element={<Bid />} />
      <Route path="/create-exchange/:id" element={<CreateExchange />} />
      <Route path="/create-auction/:id" element={<CreateAuction />} />
    </Routes>
  );
}

export default Routing;