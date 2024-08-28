document.addEventListener('DOMContentLoaded', function () {
    const slots = {
        "Lunes": ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM"],
        "Martes": ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM"],
        "Miércoles": ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM"],
        "Jueves": ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM"],
        "Viernes": ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM"],
        "Sábado": ["9:00 AM", "10:00 AM", "11:00 AM"],
        "Domingo": []
    };

    const calendar = document.querySelectorAll('.day');
    const selectedSlotElement = document.getElementById('selected-slot');
    const bookButton = document.getElementById('book-appointment');

    let selectedSlot = null;

    // Load booked appointments
    const bookedAppointments = JSON.parse(localStorage.getItem('misCitas')) || [];

    calendar.forEach(day => {
        const dayName = day.getAttribute('data-day');
        const slotsContainer = day.querySelector('.slots');
        
        // Filter out booked slots
        const availableSlots = slots[dayName].filter(slot => 
            !bookedAppointments.some(appointment => 
                appointment.day === dayName && appointment.time === slot
            )
        );

        // Clear existing slots
        slotsContainer.innerHTML = '';

        availableSlots.forEach(slotTime => {
            const slot = document.createElement('div');
            slot.className = 'slot';
            slot.textContent = slotTime;
            slotsContainer.appendChild(slot);

            slot.addEventListener('click', function () {
                if (selectedSlot) {
                    selectedSlot.classList.remove('selected');
                }
                slot.classList.add('selected');
                selectedSlot = slot;
                selectedSlotElement.textContent = `Cita seleccionada para: ${dayName} a las ${slotTime}`;
                bookButton.disabled = false;
            });
        });
    });

    bookButton.addEventListener('click', function () {
        if (selectedSlot) {
            const appointment = {
                day: selectedSlot.parentElement.getAttribute('data-day'),
                time: selectedSlot.textContent
            };

            // Add appointment to localStorage
            bookedAppointments.push(appointment);
            localStorage.setItem('misCitas', JSON.stringify(bookedAppointments));

            // Remove slot from the calendar
            selectedSlot.remove();
            selectedSlotElement.textContent = 'Seleccione una fecha y hora.';
            bookButton.disabled = true;
        }
    });
});
