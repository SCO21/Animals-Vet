document.addEventListener('DOMContentLoaded', function () {
    const citasContainer = document.querySelector('.citas-container');
    const citas = JSON.parse(localStorage.getItem('misCitas')) || [];

    citas.forEach((cita, index) => {
        const citaElement = document.createElement('div');
        citaElement.className = 'cita';
        citaElement.textContent = `Cita para: ${cita.day} a las ${cita.time}`;
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', function () {
            // Remove appointment from localStorage
            citas.splice(index, 1);
            localStorage.setItem('misCitas', JSON.stringify(citas));
            citaElement.remove();
            
            // Return the slot to available slots
            const slotsContainer = document.querySelector(`[data-day="${cita.day}"] .slots`);
            const slot = document.createElement('div');
            slot.className = 'slot';
            slot.textContent = cita.time;
            slotsContainer.appendChild(slot);
        });
        
        citaElement.appendChild(deleteButton);
        citasContainer.appendChild(citaElement);
    });
});
