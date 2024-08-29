// src/components/CalendarComponent.js
import React, { useState, useEffect } from 'react';
import './Calendar.css'; // Asegúrate de que este archivo CSS exista

const CalendarComponent = () => {
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [dates, setDates] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          console.error('No token found');
          setError('No token found. Please log in again.');
          return;
        }

        const response = await fetch('http://localhost:4000/appointments/getAll', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error(`Network response was not ok: ${response.statusText}`);
          setError(`Error fetching appointments: ${response.statusText}`);
          return;
        }

        const result = await response.json();
        console.log('Datos recibidos de la API:', result);

        if (result.status === 200 && Array.isArray(result.data)) {
          setAppointments(result.data);
        } else {
          console.error('Error: Expected an array of appointments');
          setError('Error: Expected an array of appointments');
          setAppointments([]);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Error fetching appointments');
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    const generateAvailableSlots = () => {
      const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
      const startHour = 10;
      const endHour = 18;
      const slots = {};
      const today = new Date();

      days.forEach((day, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() + index);
        const dayName = days[index];
        if (dayName !== "Domingo") {
          const dailySlots = [];
          for (let hour = startHour; hour < endHour; hour++) {
            const slotTime = `${hour}:00`;
            const isAvailable = !appointments.some(appointment => {
              const appointmentDate = new Date(appointment.date);
              const appointmentHour = new Date(appointment.start_time).getHours();
              const isSlotOccupied = appointmentDate.toDateString() === date.toDateString() &&
                appointmentHour === hour;

              if (isSlotOccupied) {
                console.log(`Cita ocupada detectada: ${appointmentDate.toDateString()} ${slotTime}`);
              }

              return isSlotOccupied;
            });

            if (isAvailable) {
              dailySlots.push(slotTime);
            }
          }
          slots[dayName] = dailySlots;
          setDates(prevDates => ({
            ...prevDates,
            [dayName]: date.toISOString().split('T')[0] // Formato YYYY-MM-DD
          }));
        } else {
          slots[dayName] = [];
        }
      });

      setAvailableSlots(slots);
    };

    generateAvailableSlots();
  }, [appointments]);

  const handleSlotClick = (day, slot) => {
    setSelectedSlot({ day, slot });
    console.log(`Slot clicked: ${day} ${slot}`); // Verifica que se esté registrando el clic
  };

  const handleBookAppointment = async () => {
    if (selectedSlot) {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          console.error('No token found');
          setError('No token found. Please log in again.');
          return;
        }

        const response = await fetch('http://localhost:4000/appointments/register', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: dates[selectedSlot.day],
            startTime: selectedSlot.slot
          }),
        });

        const data = await response.json();
        console.log('Respuesta del servidor al intentar agendar:', data);

        if (response.ok && data.status === 201 && data.message === 'Appointment created successfully') {
          alert('Cita agendada exitosamente!');
          // Actualiza las citas y slots
          setAppointments(prevAppointments => [
            ...prevAppointments,
            {
              date: dates[selectedSlot.day],
              start_time: selectedSlot.slot
            }
          ]);
          setAvailableSlots(prevSlots => {
            const updatedSlots = { ...prevSlots };
            const index = updatedSlots[selectedSlot.day].indexOf(selectedSlot.slot);
            if (index > -1) {
              updatedSlots[selectedSlot.day].splice(index, 1); // Elimina el slot ocupado
            }
            return updatedSlots;
          });
          setSelectedSlot(null);
        } else {
          console.error('Error al agendar la cita:', data);
          setError(`Error al agendar la cita: ${data.message}`);
        }
      } catch (error) {
        console.error('Error booking appointment:', error);
        setError('Error booking appointment');
      }
    } else {
      console.error('No slot selected');
      setError('No slot selected');
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Agendar Cita</h1>
        <p>Seleccione una fecha y hora disponibles para su cita.</p>
      </header>

      {error && <div id="error">{error}</div>}

      <div id="calendar">
        <div className="week">
          {Object.keys(availableSlots).map(day => (
            <div className="day" key={day} data-day={day}>
              <div className="day-header">
                <h3>{day}</h3>
                <span>{dates[day]}</span>
              </div>
              <div className="slots">
                {availableSlots[day].map((slot, index) => (
                  <div
                    key={index}
                    className={`slot ${selectedSlot?.day === day && selectedSlot?.slot === slot ? 'selected' : ''}`}
                    onClick={() => handleSlotClick(day, slot)}
                  >
                    {slot}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div id="appointment-details">
        <h2>Detalles de la Cita</h2>
        <p id="selected-slot">
          {selectedSlot ? `Cita seleccionada para: ${selectedSlot.day} a las ${selectedSlot.slot}` : 'Seleccione una fecha y hora.'}
        </p>
        <button id="book-appointment" onClick={handleBookAppointment} disabled={!selectedSlot}>
          Solicitar Cita
        </button>
      </div>
    </div>
  );
};

export default CalendarComponent;
