import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    const userData = { name, email, password };

    try {
      const response = await fetch('http://localhost:4000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.mensaje || 'Registro correcto');
        setName('');
        setEmail('');
        setPassword('');
        setErrorMessage('');
        navigate('/login'); // Redirige a la página de inicio de sesión después del registro
      } else {
        setErrorMessage(result.mensaje || 'Error en el registro');
      }
    } catch (error) {
      console.error('Error al enviar los datos de registro:', error);
      setErrorMessage('Error en la solicitud');
    }
  };

  return (
    <div className="form-container" id="register-container">
      <h2>Crear Cuenta</h2>
      <form onSubmit={handleRegisterSubmit}>
        <div className="input-group">
          <label htmlFor="name">Nombre Completo</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="email-register">Correo Electrónico</label>
          <input
            type="email"
            id="email-register"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password-register">Contraseña</label>
          <input
            type="password"
            id="password-register"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Crear Cuenta</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <p className="toggle-text">¿Ya tienes una cuenta? <button type="button" onClick={() => navigate('/login')}>Inicia Sesión</button></p>
    </div>
  );
};

export default Register;
