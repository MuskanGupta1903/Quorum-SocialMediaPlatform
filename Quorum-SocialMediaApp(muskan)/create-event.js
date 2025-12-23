document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.create-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // prevent default form submit

        // Get form values
        const title = document.getElementById('eventTitle').value.trim();
        const type = document.getElementById('eventType').value;
        const date = document.getElementById('eventDate').value;
        const time = document.getElementById('eventTime').value;
        const location = document.getElementById('eventLocation').value.trim();
        const description = document.getElementById('eventDescription').value.trim();
        const maxParticipants = document.getElementById('maxParticipants').value;
        const registrationDeadline = document.getElementById('registrationDeadline').value;
        const googleForm = document.getElementById('googleForm').value.trim();

        // Poster handling
        let poster = '';
        const posterInput = document.getElementById('poster');
        if (posterInput.files.length > 0) {
            poster = await new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(posterInput.files[0]);
            });
        }

        // Create event object
        const event = { title, type, date, time, location, description, maxParticipants, registrationDeadline, poster, googleForm };

        // Retrieve existing events
        const events = JSON.parse(localStorage.getItem('eventsList') || '[]');

        // Add new event
        events.push(event);

        // Save to localStorage
        localStorage.setItem('eventsList', JSON.stringify(events));

        // Redirect to events page
        window.location.href = 'events.html';
    });
});
