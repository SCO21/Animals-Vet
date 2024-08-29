import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    const loginData = {
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:4000/users/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('jwtToken', result.jwtToken); // Almacena el token JWT
        onLogin(); // Notifica a App que el usuario ha iniciado sesión

        // SweetAlert2 para éxito
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          text: 'Has iniciado sesión correctamente.',
        }).then(() => {
          navigate('/main-menu'); // Redirige al menú principal
        });

      } else {
        // SweetAlert2 para error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.mensaje || 'Error en el inicio de sesión.',
        });
      }
    } catch (error) {
      console.error('Error al enviar los datos de inicio de sesión:', error);
      
      // SweetAlert2 para error de solicitud
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error en la solicitud. Inténtalo de nuevo más tarde.',
      });
    }
  };

  return (
    <div className="form-container" id="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLoginSubmit}>
        <div className="input-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      <p className="toggle-text">¿No tienes una cuenta? <button type="button" onClick={() => navigate('/register')}>Regístrate</button></p>
    </div>
  );
};

export default Login;