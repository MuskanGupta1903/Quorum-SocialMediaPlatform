document.addEventListener('DOMContentLoaded', () => {
    // Select all poll card elements on the page
    const pollCards = document.querySelectorAll('.poll-card');

    // Handle mobile menu toggle (if needed for interactive JS)
    document.getElementById('mobile-menu-toggle')?.addEventListener('change', function() {
        // Optional: Add logging or other state management here if needed
        // console.log('Mobile menu toggled:', this.checked);
    });

    // --- Poll Card Logic ---
    pollCards.forEach(card => {
        const voteButtons = card.querySelectorAll('.vote-btn');
        const voteMessage = card.querySelector('.vote-message');
        const pollId = card.getAttribute('data-poll-id');

        // Function to apply the visual vote state and update counts
        const applyVoteState = (cardElement, vote) => {
            // Remove all previous vote classes from the card
            cardElement.classList.remove('voted-yes', 'voted-no');

            // Add the new vote class to the card for styling
            cardElement.classList.add(`voted-${vote}`);

            // Display confirmation message
            voteMessage.textContent = `You voted: ${vote.toUpperCase()}`;

            // Update the specific count
            const votedCountElement = cardElement.querySelector(`.response-count-${vote}`);
            if (!votedCountElement) return;

            // Check local storage to prevent double-incrementing on refresh/re-vote
            if (localStorage.getItem(`vote-status-${pollId}`) !== 'voted') {
                let currentCount = parseInt(votedCountElement.textContent) || 0;
                votedCountElement.textContent = currentCount + 1;

                // Mark the poll as voted in local storage (preventing future count increments)
                localStorage.setItem(`vote-status-${pollId}`, 'voted');
            }
        };

        // Initialization: Check for a saved vote to persist state on refresh
        const savedVote = localStorage.getItem(`vote-${pollId}`);
        if (savedVote) {
            card.classList.add(`voted-${savedVote}`);
            voteMessage.textContent = `You voted: ${savedVote.toUpperCase()}`;
        }

        // Add click listener to each vote button
        voteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                // Prevent re-voting on an already voted poll (client-side check)
                if (card.classList.contains('voted-yes') || card.classList.contains('voted-no')) return;

                const selectedVote = event.currentTarget.getAttribute('data-vote');

                // 1. Save the vote selection in local storage
                localStorage.setItem(`vote-${pollId}`, selectedVote);

                // 2. Apply the new visual state and update the count
                applyVoteState(card, selectedVote);
            });
        });
    });
});
