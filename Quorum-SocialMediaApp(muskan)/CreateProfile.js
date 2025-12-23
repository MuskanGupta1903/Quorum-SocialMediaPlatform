document.addEventListener('DOMContentLoaded', () => {
    // === DOM Element Declarations ===
    const form = document.getElementById('profile-form');
    const bioTextarea = document.getElementById('bio');
    const charCountDisplay = document.querySelector('.char-count');
    const customInterestInput = form.querySelector('.custom-interest input[type="text"]');
    const addInterestButton = form.querySelector('.add-btn');
    const popularInterestsContainer = document.querySelector('.popular-interests');
    const usernameCheckbox = document.getElementById('username-check');
    const progressDiv = document.querySelector('.progress');
    const selectedCountDisplay = document.querySelector('.selected-count');

    // Profile Picture Elements
    const profilePicInput = document.getElementById('profile-pic-input');
    const profileImgContainer = document.querySelector('.profile-img');
    const profilePreviewImg = document.getElementById('profile-preview-img');
    const cameraIcon = document.querySelector('.camera-icon');

    const MAX_INTERESTS = 10;

    // --- NEW: Variable to hold the Base64 string of the uploaded image ---
    let profileImageBase64 = null;

    // === Core Utility Functions ===

    /**
     * Calculates and updates the progress bar width based on form completion.
     */
    function updateProgress() {
        const totalSteps = 6; // Profile Pic, Full Name, Username, Department, Bio, Interests
        let completedSteps = 0;

        // 1. Profile Picture: Check if Base64 string is present
        if (profileImageBase64) {
            completedSteps++;
        }

        // 2. Full Name
        const fullnameInput = document.getElementById('fullname');
        if (fullnameInput && fullnameInput.value.trim() !== '' && fullnameInput.checkValidity()) {
            completedSteps++;
        }

        // 3. Username (requires input and confirmation checkbox checked)
        const usernameInput = document.getElementById('username');
        if (usernameInput && usernameInput.value.trim() !== '' && usernameCheckbox.checked) {
            completedSteps++;
        }

        // 4. Department
        const departmentSelect = document.getElementById('department');
        if (departmentSelect && departmentSelect.value !== '') {
            completedSteps++;
        }

        // 5. Bio (Filled at all)
        if (bioTextarea && bioTextarea.value.trim() !== '') {
            completedSteps++;
        }

        // 6. Interests (At least one selected)
        if (document.querySelectorAll('.interest-checkbox:checked').length > 0) {
            completedSteps++;
        }

        const progressPercentage = Math.min(100, (completedSteps / totalSteps) * 100);
        progressDiv.style.width = `${progressPercentage}%`;
    }

    // --- 1. Profile Picture Upload and Preview Logic (MODIFIED) ---

    if (profilePicInput && profilePreviewImg) {
        profilePicInput.addEventListener('change', function() {
            const file = this.files[0];

            if (file) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    const base64String = e.target.result;

                    // 1. Store the Base64 string (THIS IS THE KEY CHANGE)
                    profileImageBase64 = base64String;

                    // 2. Display the preview image
                    profilePreviewImg.src = base64String;
                    profilePreviewImg.style.display = 'block';

                    // 3. Update CSS
                    profileImgContainer.classList.add('uploaded');
                    if (cameraIcon) cameraIcon.style.display = 'none';

                    updateProgress();
                };

                // Read the file as a Data URL (Base64 string)
                reader.readAsDataURL(file);
            } else {
                // Revert to placeholder state
                profileImageBase64 = null; // Clear the stored data
                profilePreviewImg.src = "";
                profilePreviewImg.style.display = 'none';
                profileImgContainer.classList.remove('uploaded');
                if (cameraIcon) cameraIcon.style.display = 'block';

                updateProgress();
            }
        });
    }

    // === 2. Bio Character Count Logic ===

    if (bioTextarea) {
        const updateCharCount = () => {
            const currentLength = bioTextarea.value.length;
            charCountDisplay.textContent = `${currentLength}/${bioTextarea.getAttribute('maxlength')}`;
            updateProgress();
        };

        bioTextarea.addEventListener('input', updateCharCount);
        updateCharCount(); // Initial update
    }

    // === 3. Interest Selection Limit Logic ===

    /**
     * Updates the selected count display and enforces the selection limit.
     */
    function updateInterestsCount() {
        const currentCheckboxes = document.querySelectorAll('.interest-checkbox');
        const checkedInterests = document.querySelectorAll('.interest-checkbox:checked');
        const count = checkedInterests.length;

        selectedCountDisplay.textContent = `${count}/${MAX_INTERESTS} interests selected`;

        currentCheckboxes.forEach(checkbox => {
            if (count >= MAX_INTERESTS && !checkbox.checked) {
                checkbox.disabled = true;
                checkbox.nextElementSibling.style.opacity = '0.5';
                checkbox.nextElementSibling.style.pointerEvents = 'none';
            } else {
                checkbox.disabled = false;
                checkbox.nextElementSibling.style.opacity = '1';
                checkbox.nextElementSibling.style.pointerEvents = 'auto';
            }
        });

        updateProgress();
    }

    // Initial setup for existing checkboxes
    document.querySelectorAll('.interest-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateInterestsCount);
    });

    // --- Custom Interest Addition Logic ---

    addInterestButton.addEventListener('click', () => {
        const newInterest = customInterestInput.value.trim();
        const checkedInterests = document.querySelectorAll('.interest-checkbox:checked');

        if (!newInterest) {
            alert("Please enter a custom interest.");
            return;
        }

        if (checkedInterests.length >= MAX_INTERESTS) {
            alert(`You can select a maximum of ${MAX_INTERESTS} interests. Please deselect one first.`);
            return;
        }

        if (newInterest.length > 25) {
            alert("Interest name is too long. Keep it under 25 characters.");
            return;
        }

        const sanitizedValue = newInterest.toLowerCase().replace(/\s/g, '_').replace(/[^a-z0-9_]/g, '');
        const interestId = `interest-${sanitizedValue}`;

        if (document.getElementById(interestId)) {
            alert(`The interest '${newInterest}' already exists.`);
            return;
        }

        const newCheckbox = document.createElement('input');
        newCheckbox.type = 'checkbox';
        newCheckbox.id = interestId;
        newCheckbox.className = 'interest-checkbox';
        newCheckbox.name = 'interests';
        newCheckbox.value = sanitizedValue;
        newCheckbox.checked = true;

        const newLabel = document.createElement('label');
        newLabel.htmlFor = interestId;
        newLabel.className = 'interest-label';
        newLabel.innerHTML = `<span>✨</span> ${newInterest}`;

        popularInterestsContainer.appendChild(newCheckbox);
        popularInterestsContainer.appendChild(newLabel);

        newCheckbox.addEventListener('change', updateInterestsCount);

        customInterestInput.value = '';
        updateInterestsCount();
    });

    // === 4. Real-time Progress Update for form inputs and selections ===
    const interactiveElements = form.querySelectorAll('input:not([type="checkbox"]):not([type="file"]), select');
    interactiveElements.forEach(element => {
        element.addEventListener('input', updateProgress);
    });
    // Special case for the username checkbox
    usernameCheckbox.addEventListener('change', updateProgress);


    // === 5. Form Submission and Data Saving Logic (MODIFIED) ===

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // <-- IMPORTANT: Stop the default form submission

        const usernameInput = document.getElementById('username');
        const usernamePattern = /^[a-z0-9_]+$/;

        // Perform validation checks
        if (!form.checkValidity() || !usernameCheckbox.checked || !usernamePattern.test(usernameInput.value)) {
            // Re-run checks to display specific alerts/cues if needed
            if (!usernameCheckbox.checked) {
                alert('You must confirm that your username cannot be changed later.');
            } else if (!usernamePattern.test(usernameInput.value)) {
                alert('Username must only contain lowercase letters, numbers, and underscores.');
            }
            return;
        }

        // --- Data Collection ---
        const selectedInterests = Array.from(document.querySelectorAll('.interest-checkbox:checked'))
                                      .map(checkbox => checkbox.value);

        const profileData = {
            // General Info
            fullName: document.getElementById('fullname').value.trim(),
            username: usernameInput.value.trim(),
            department: document.getElementById('department').value,
            bio: bioTextarea.value.trim(),

            // Image Data (Base64 string is saved here!)
            profileImageBase64: profileImageBase64,

            // Interests
            interests: selectedInterests,

            // Dummy/Default Data for the profile page
            location: 'University Campus',
            joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            followers: Math.floor(Math.random() * 50) + 10,
            following: Math.floor(Math.random() * 30) + 5,
            posts: Math.floor(Math.random() * 10) + 1,
        };

        // --- Store Data in localStorage and Redirect ---
        try {
            const jsonProfile = JSON.stringify(profileData);
            // Save the data under a specific key
            localStorage.setItem('userProfile', jsonProfile);

            console.log('Profile data (including Base64 image) saved successfully.');

            // Redirect to the profile view page (assuming your profile page is named 'profile_view.html')
            window.location.href = 'ProfilePage.html';

        } catch (e) {
            console.error('Failed to save profile data to localStorage:', e);
            alert('There was an issue saving your profile. Please try again.');
        }
    });

    // Initial progress update on page load
    updateProgress();
});