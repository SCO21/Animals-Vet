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

    calendar.forEach(day => {
        const dayName = day.getAttribute('data-day');
        const slotsContainer = day.querySelector('.slots');
        
        slots[dayName].forEach(slotTime => {
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
        alert(`Cita solicitada para: ${selectedSlotElement.textContent}`);
    });
});
