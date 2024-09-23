import React, { useEffect, useState } from 'react';
import './Calendar.css'; // Reutiliza los estilos del calendario de citas

const MyAgenda = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null); // Estado para la cita seleccionada
  const [appointmentDetails, setAppointmentDetails] = useState(null); // Detalles de la cita seleccionada
  const [error, setError] = useState(null);
  const [weekDates, setWeekDates] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem('jwtToken');

      try {
        const response = await fetch('http://localhost:4000/appointments/getHorary', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching horary');
        }

        const result = await response.json();
        if (result.status === 200 && result.data) {
          const appointmentsData = [];

          // Iterar sobre los días y horas
          for (const [day, hours] of Object.entries(result.data)) {
            for (const [time, appointmentInfo] of Object.entries(hours)) {
              if (!appointmentInfo.disponible) { // Solo agregar citas no disponibles
                appointmentsData.push({
                  id: appointmentInfo.idCita,
                  dia: day,
                  hora: appointmentInfo.hora,
                });
              }
            }
          }
          console.log('Datos recibidos de la API:', result);
          console.log('Citas procesadas:', appointmentsData);
          setAppointments(appointmentsData);
        } else {
          console.error('Error en la respuesta de la API:', result);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error al obtener citas:', err);
      }
    };

    fetchAppointments();
  }, []);

  // Generar las fechas de la semana (igual que en el calendario de agendamiento)
  const getWeekDates = () => {
    const startOfWeek = new Date('2024-09-22'); // Empieza el domingo 22 de septiembre de 2024
    const daysOfWeek = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

    const dates = daysOfWeek.map((_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return {
        day: daysOfWeek[index],
        date: date.toISOString().split('T')[0], // Formato YYYY-MM-DD
      };
    });

    setWeekDates(dates);
  };

  useEffect(() => {
    getWeekDates();
  }, []);

  // Función para obtener los detalles de la cita
  const fetchAppointmentDetails = async (appointmentId) => {
    const token = localStorage.getItem('jwtToken');

    try {
      const response = await fetch(`http://localhost:4000/appointments/getOne?id=${appointmentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching appointment details');
      }

      const result = await response.json();
      if (result.status === 200 && result.data) {
        setAppointmentDetails(result.data);
      } else {
        console.error('Error en la respuesta de la API:', result);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error al obtener detalles de la cita:', err);
    }
  };

  // Manejar el clic en una cita para mostrar detalles
  const handleSlotClick = (appointment) => {
    setSelectedAppointment(appointment);
    fetchAppointmentDetails(appointment.id); // Llamar a la API para obtener detalles adicionales
  };

  return (
    <div className="container">
      <h1>Mi Agenda</h1>
      {error && <p>Error: {error}</p>}

      <div id="calendar">
        <div className="week">
          {weekDates.map(({ day }) => (
            <div className="day" key={day} data-day={day}>
              <div className="day-header">
                <h3>{day}</h3>
              </div>
              <div className="slots">
                {appointments
                  .filter(appointment => appointment.dia === day)
                  .map(appointment => (
                    <div
                      key={appointment.id}
                      className={`slot ${selectedAppointment?.id === appointment.id ? 'selected' : ''}`}
                      onClick={() => handleSlotClick(appointment)}
                    >
                      {appointment.hora}
                    </div>
                  ))
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      <div id="appointment-details">
        <h2>Detalles de la Cita</h2>
        {appointmentDetails ? (
          <div>
            <p>Cita ID: {selectedAppointment.id}</p>
            <p>Fecha: {appointmentDetails.date}</p>
            <p>Hora de inicio: {appointmentDetails.start_time}</p>
            <p>Hora de fin: {appointmentDetails.end_time}</p>
            <p>Email del cliente: {appointmentDetails.email}</p>
          </div>
        ) : (
          <p>No se ha seleccionado ninguna cita o no hay detalles disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default MyAgenda;
