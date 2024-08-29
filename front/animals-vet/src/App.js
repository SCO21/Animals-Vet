import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import MainMenu from './components/MainMenu';
import CalendarComponent from './components/calendar'; // Asegúrate de que el nombre del archivo es correcto
import MyAppointments from './components/MyAppointments';
import './App.css'; // Aquí debes poner tu CSS

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('jwtToken'); // Limpiar token al cerrar sesión
  };

  return (
    <Router>
      <div className="container">
        <div className="logo">
          <img src="logoAnimalsVet.jpg" alt="Logo Veterinaria" />
          <h1>Animals Vet</h1>
        </div>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/main-menu" /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/main-menu" /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/main-menu" /> : <Register />}
          />
          <Route
            path="/main-menu"
            element={isAuthenticated ? <MainMenu onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/solicitar-cita"
            element={isAuthenticated ? <CalendarComponent /> : <Navigate to="/login" />}
          />
          <Route
            path="/mis-citas"
            element={isAuthenticated ? <MyAppointments /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
