import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainMenu.css';

const MainMenu = ({ onLogout }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    console.log('User Role:', role);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="container">
      <header>
        <h1>Bienvenido a Animals Vet</h1>
        <p>Seleccione una opción para continuar:</p>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </header>

      <div className="menu">
        {userRole === 'Client' && (
          <>
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
          </>
        )}

        {userRole === 'Vet' && (
          <>
            <div className="menu-item" onClick={() => handleNavigation('/mi-agenda')}>
              <h2>Mi Agenda</h2>
              <p>Vea las citas agendadas.</p>
            </div>
            <div className="menu-item" onClick={() => handleNavigation('/registrar-dia')}>
              <h2>Registrar Día de Trabajo</h2>
              <p>Establezca su horario de trabajo.</p>
            </div>
            <div className="menu-item" onClick={() => handleNavigation('/inventario')}>
              <h2>Inventario</h2>
              <p>Gestione el inventario de la clínica.</p>
            </div>
          </>
        )}

        {userRole === 'Secretary' && (
          <>
            <div className="menu-item" onClick={() => handleNavigation('/mi-agenda')}>
              <h2>Ver Agenda</h2>
              <p>Vea las citas del veterinario.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MainMenu;
