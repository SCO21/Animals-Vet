// src/components/MyAppointments.js
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './MyAppointments.css'; // Asegúrate de que este archivo exista

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch('http://localhost:4000/appointments/getAll', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Datos recibidos de la API:', result);

        if (result.status === 200 && Array.isArray(result.data)) {
          setAppointments(result.data);
        } else {
          console.error('Error: Expected an array of appointments');
          setAppointments([]);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setAppointments([]);
      }
    };

    fetchAppointments();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`http://localhost:4000/appointments/delete?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Respuesta al eliminar cita:', data);

      if (data.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Cita eliminada',
          text: 'La cita ha sido eliminada correctamente.',
        });

        setAppointments(prevAppointments =>
          prevAppointments.filter(appointment => appointment.id !== id)
        );
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la cita.',
        });
      }
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al eliminar la cita.',
      });
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Mis Citas</h1>
        <p>Aquí puedes ver y gestionar tus citas.</p>
      </header>

      <div id="appointments-list">
        {appointments.length > 0 ? (
          appointments.map(appointment => (
            <div key={appointment.id} className="appointment">
              <div className="appointment-info">
                <p>{`Fecha: ${appointment.date} | Hora: ${appointment.start_time}`}</p>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDelete(appointment.id)}
              >
                <img src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" alt="Delete Icon" />
              </button>
            </div>
          ))
        ) : (
          <p>No tienes citas agendadas.</p>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
