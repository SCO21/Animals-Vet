import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterWorkDay = () => {
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleRegisterDay = async (event) => {
    event.preventDefault();

    const workDayData = {
      diaSemana: dayOfWeek,
      horaInicio: startTime,
      horaFin: endTime,
    };

    console.log("Datos enviados:", workDayData); // Verificar datos a enviar

    try {
      const response = await fetch('http://localhost:4000/appointments/addHorary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        },
        body: JSON.stringify(workDayData),
      });

      console.log(response); // Verificar la respuesta

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage(result.message);
        setErrorMessage('');
      } else {
        const result = await response.json();
        setErrorMessage(result.message || 'Error al registrar el día de trabajo.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error al registrar el día de trabajo:', error);
      setErrorMessage('Error en la solicitud.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="form-container">
      <h2>Registrar Día de Trabajo</h2>
      <form onSubmit={handleRegisterDay}>
        <div className="input-group">
          <label htmlFor="dayOfWeek">Día de la Semana</label>
          <select
            id="dayOfWeek"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            required
          >
            <option value="">Seleccione un día</option>
            <option value="lunes">Lunes</option>
            <option value="martes">Martes</option>
            <option value="miércoles">Miércoles</option>
            <option value="jueves">Jueves</option>
            <option value="viernes">Viernes</option>
            <option value="sábado">Sábado</option>
            <option value="domingo">Domingo</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="startTime">Hora de Inicio</label>
          <input
            type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="endTime">Hora de Fin</label>
          <input
            type="time"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registrar Día de Trabajo</button>
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button onClick={() => navigate('/main-menu')}>Volver al Menú Principal</button>
    </div>
  );
};

export default RegisterWorkDay;
