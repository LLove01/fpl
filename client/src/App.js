import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PlayerAnalysis from './components/PlayerAnalysis';
import TeamInsights from './components/TeamInsights';
import TransferTrends from './components/TransferTrends';
import About from './components/About';
import Profile from './components/Profile';
import Leagues from './components/Leagues';
import Login from './components/Login';
import Logout from './components/Logout';
import './App.css';
import { UserContext } from "./userContext";
import Register from './components/Register';

function App() {
  const [user, setUser] = useState(localStorage.user ? JSON.parse(localStorage.user) : null);
  const updateUserData = (userInfo) => {
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  }

  return (
    <BrowserRouter>
      <UserContext.Provider value={{
        user: user,
        setUserContext: updateUserData
      }}>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<PlayerAnalysis />} />
            <Route path="/team-insights" element={<TeamInsights />} />
            <Route path="/transfer-trends" element={<TransferTrends />} />
            <Route path="/leagues/:league_id" element={<Leagues />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
          <Footer />
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
