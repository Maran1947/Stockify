import React from "react";
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import Dashboard from "./pages/dashboard/Dashboard";
import Orders from "./pages/orders/Orders";
import Positions from "./pages/positions/Positions";
import Account from "./pages/account/Account";
import Signup from "./pages/authentication/signup/Signup";
import Signin from "./pages/authentication/signin/Signin";
import Tools from "./pages/tools/Tools";
import TradingChart from "./pages/tradingChart/TradingChart";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/positions" element={<Positions />} />
            <Route path="/account" element={<Account />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/chart" element={<TradingChart />} />
          </Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
