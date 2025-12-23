document.addEventListener('DOMContentLoaded', () => {
    const eventsContainer = document.getElementById('eventsGrid');
    const events = JSON.parse(localStorage.getItem('eventsList') || '[]');
    eventsContainer.innerHTML = '';

    if (events.length === 0) {
        eventsContainer.innerHTML = '<p style="padding:1rem;">No events found. Create a new event to see it here.</p>';
        return;
    }

    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.setAttribute('data-type', event.type);

        const formattedDate = new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        eventCard.innerHTML = `
            <div class="event-header">
                <span class="event-type ${event.type}">${event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
                <span class="event-date">${formattedDate}</span>
            </div>
            <h3 class="event-title">${event.title}</h3>
            ${event.description ? `<p class="event-description">${event.description}</p>` : ''}
            <div class="event-details">
                ${event.location ? `<div class="detail"><span class="icon">📍</span>${event.location}</div>` : ''}
                ${event.time ? `<div class="detail"><span class="icon">⏰</span>${event.time}</div>` : ''}
                ${event.maxParticipants ? `<div class="detail"><span class="icon">👥</span>Max: ${event.maxParticipants}</div>` : ''}
                ${event.registrationDeadline ? `<div class="detail"><span class="icon">⏳</span>Register by: ${event.registrationDeadline}</div>` : ''}
                ${event.googleForm ? `<div class="detail"><span class="icon">📝</span><a href="${event.googleForm}" target="_blank">Form Link</a></div>` : ''}
            </div>
            ${event.poster ? `<img src="${event.poster}" alt="Poster" style="max-width:100%; margin-bottom:1rem; border-radius:8px;">` : ''}
        `;

        eventsContainer.appendChild(eventCard);
    });

    // Search functionality
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        searchBox.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            document.querySelectorAll('.event-card').forEach(card => {
                const title = card.querySelector('.event-title').textContent.toLowerCase();
                const type = card.getAttribute('data-type').toLowerCase();
                card.style.display = title.includes(query) || type.includes(query) ? 'block' : 'none';
            });
        });
    }
});
