import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainMenu.css'; // Asegúrate de que este archivo exista

const MainMenu = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/'); // Redirige al inicio de sesión
  };

  return (
    <div className="container">
      <header>
        <h1>Bienvenido a Animals Vet</h1>
        <p>Seleccione una opción para continuar:</p>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </header>
      <div className="menu">
        <div className="menu-item" onClick={() => handleNavigation('/solicitar-cita')}>
          <h2>Solicitar Cita</h2>
          <p>Agende una cita para su mascota.</p>
        </div>
        <div className="menu-item" onClick={() => handleNavigation('/mis-citas')}>
          <h2>Mis Citas</h2>
          <p>Vea y gestione sus citas.</p>
        </div>
        <div className="menu-item" onClick={() => window.location.href = 'https://wa.me/3024061472'}>
          <h2>Contactar por WhatsApp</h2>
          <p>Comuníquese con nosotros.</p>
        </div>
        <div className="menu-item" onClick={() => handleNavigation('/ver-servicios')}>
          <h2>Ver Servicios</h2>
          <p>Conozca los servicios que ofrecemos.</p>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
