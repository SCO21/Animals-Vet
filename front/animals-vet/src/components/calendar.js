import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './Calendar.css';

const CalendarComponent = () => {
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [weekDates, setWeekDates] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          setError('No token found. Please log in again.');
          Swal.fire({
            title: 'Error',
            text: 'No token found. Please log in again.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
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
          setError(`Error fetching appointments: ${response.statusText}`);
          return;
        }

        const result = await response.json();
        console.log("Appointments fetched:", result);
        if (result.status === 200 && Array.isArray(result.data)) {
          setAppointments(result.data);
        } else {
          setError('Error: Expected an array of appointments');
          setAppointments([]);
        }
      } catch (error) {
        setError('Error fetching appointments');
      }
    };

    fetchAppointments();
  }, []);

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

  const fetchAvailableSlots = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('No token found. Please log in again.');
        return;
      }

      const response = await fetch('http://localhost:4000/appointments/getHorary', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        setError(`Error fetching available slots: ${response.statusText}`);
        return;
      }

      const result = await response.json();
      console.log("Available slots fetched:", result);
      if (result.status === 200 && result.data) {
        const formattedSlots = {};

        for (const day in result.data) {
          if (result.data.hasOwnProperty(day)) {
            formattedSlots[day] = Object.keys(result.data[day]).filter(
              slot => result.data[day][slot].disponible
            );
          }
        }

        console.log("Formatted available slots:", formattedSlots);
        setAvailableSlots(formattedSlots);
      } else {
        setError('Error: Expected valid data structure');
        setAvailableSlots({});
      }
    } catch (error) {
      setError('Error fetching available slots');
    }
  };

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const handleSlotClick = (day, slot) => {
    console.log("Slot clicked:", { day, slot });
    setSelectedSlot({ day, slot });
  };

  const handleBookAppointment = async () => {
    if (selectedSlot) {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          setError('No token found. Please log in again.');
          return;
        }

        const selectedDate = weekDates.find(d => d.day === selectedSlot.day)?.date;

        const response = await fetch('http://localhost:4000/appointments/register', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: selectedDate,
            startTime: selectedSlot.slot,
          }),
        });

        const data = await response.json();
        if (response.ok && data.status === 201) {
          Swal.fire({
            title: 'Éxito!',
            text: 'Cita agendada exitosamente!',
            icon: 'success',
            confirmButtonText: 'OK',
          });

          setAppointments(prevAppointments => [
            ...prevAppointments,
            {
              date: selectedDate,
              start_time: selectedSlot.slot,
            },
          ]);

          setAvailableSlots(prevSlots => {
            const updatedSlots = { ...prevSlots };
            const index = updatedSlots[selectedSlot.day].indexOf(selectedSlot.slot);
            if (index > -1) {
              updatedSlots[selectedSlot.day].splice(index, 1);
            }
            return updatedSlots;
          });
          setSelectedSlot(null);
        } else {
          Swal.fire({
            title: 'Error',
            text: `Error al agendar la cita: ${data.message}`,
            icon: 'error',
            confirmButtonText: 'OK',
          });
          setError(`Error al agendar la cita: ${data.message}`);
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Error al agendar la cita',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        setError('Error booking appointment');
      }
    } else {
      Swal.fire({
        title: 'Advertencia',
        text: 'No se ha seleccionado ningún horario.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
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
          {weekDates.map(({ day, date }) => (
            <div className="day" key={day} data-day={day}>
              <div className="day-header">
                <h3>{day}</h3>
                <span>{date}</span>
              </div>
              <div className="slots">
                {availableSlots[day] && availableSlots[day].length > 0 ? (
                  availableSlots[day].map((slot, index) => (
                    <div
                      key={index}
                      className={`slot ${selectedSlot?.day === day && selectedSlot?.slot === slot ? 'selected' : ''}`}
                      onClick={() => handleSlotClick(day, slot)}
                    >
                      {slot}
                    </div>
                  ))
                ) : (
                  <div>No hay horarios disponibles</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div id="appointment-details">
        <h2>Detalles de la Cita</h2>
        {selectedSlot ? (
          <div>
            <p>Dia: {selectedSlot.day}</p>
            <p>Hora: {selectedSlot.slot}</p>
            <button onClick={handleBookAppointment}>Agendar Cita</button>
          </div>
        ) : (
          <p>No se ha seleccionado ningún horario.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarComponent;
