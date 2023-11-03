import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PlayerAnalysis from './components/PlayerAnalysis';
import TeamInsights from './components/TeamInsights';
import TransferTrends from './components/TransferTrends';
import About from './components/About';
import Profile from './components/Profile';
import Login from './components/Login';
import Logout from './components/Logout';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<PlayerAnalysis />} />
          <Route path="/team-insights" element={<TeamInsights />} />
          <Route path="/transfer-trends" element={<TransferTrends />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
