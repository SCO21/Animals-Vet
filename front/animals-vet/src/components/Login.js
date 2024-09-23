import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    const loginData = { email, password };

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
        localStorage.setItem('userRole', result.role)
        console.log(response)
        onLogin(); // Notifica a App que el usuario ha iniciado sesión
        navigate('/main-menu'); // Redirige al menú principal
      } else {
        setErrorMessage(result.mensaje || 'Error en el inicio de sesión');
      }
    } catch (error) {
      console.error('Error al enviar los datos de inicio de sesión:', error);
      setErrorMessage('Error en la solicitud');
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
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <p className="toggle-text">¿No tienes una cuenta? <button type="button" onClick={() => navigate('/register')}>Regístrate</button></p>
    </div>
  );
};

export default Login;
