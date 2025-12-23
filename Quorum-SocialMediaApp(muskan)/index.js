document.addEventListener('DOMContentLoaded', () => {
    // Get all required elements using the new IDs
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorBox = document.getElementById('error-box');

    // Strict Chitkara email validation regex
    const universityEmailPattern = /^[a-zA-Z0-9._%+-]+@chitkara\.edu\.in$/i;
    const minPasswordLength = 6;
    const successRedirectPage = 'CreateProfile.html';

    function displayError(message) {
        errorBox.innerHTML = '⚠ ' + message;
        errorBox.classList.add('show');
    }

    function clearError() {
        errorBox.classList.remove('show');
        errorBox.textContent = '';
    }

    function setInputStatus(input, isValid) {
        if (isValid) {
            input.classList.remove('invalid-field');
            input.classList.add('valid-field');
        } else {
            input.classList.remove('valid-field');
            input.classList.add('invalid-field');
        }
    }

    if (loginForm && emailInput && passwordInput && errorBox) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            clearError();

            if (!loginForm.checkValidity()) {
                loginForm.reportValidity();
            }

            const email = emailInput.value.trim();
            const password = passwordInput.value;
            let formIsValid = true;

            // --- Email Validation ---
            if (email === '') {
                displayError('Email field cannot be empty.');
                setInputStatus(emailInput, false);
                formIsValid = false;
            } else if (!universityEmailPattern.test(email)) {
                displayError('Only email addresses ending in @chitkara.edu.in are allowed.');
                setInputStatus(emailInput, false);
                formIsValid = false;
            } else {
                setInputStatus(emailInput, true);
            }

            // --- Password Validation ---
            if (password === '') {
                if (formIsValid) displayError('Password field cannot be empty.');
                setInputStatus(passwordInput, false);
                formIsValid = false;
            } else if (password.length < minPasswordLength) {
                if (formIsValid) displayError(`Password must be at least ${minPasswordLength} characters long.`);
                setInputStatus(passwordInput, false);
                formIsValid = false;
            } else {
                if (formIsValid) setInputStatus(passwordInput, true);
            }

            // ✅ Redirect if valid
            if (formIsValid) {
                console.log('Validation successful. Redirecting to:', successRedirectPage);
                window.location.href = successRedirectPage;
            } else {
                console.warn('Form validation failed — staying on login page.');
                emailInput.focus();
            }
        });

        // --- Real-time Email Feedback ---
        emailInput.addEventListener('blur', () => {
            const email = emailInput.value.trim();
            if (email !== '') {
                const isValid = universityEmailPattern.test(email);
                setInputStatus(emailInput, isValid);
                if (isValid) clearError();
            } else {
                emailInput.classList.remove('invalid-field', 'valid-field');
            }
        });

        // --- Real-time Password Feedback ---
        passwordInput.addEventListener('blur', () => {
            const password = passwordInput.value;
            if (password !== '') {
                const isValid = password.length >= minPasswordLength;
                setInputStatus(passwordInput, isValid);
            } else {
                passwordInput.classList.remove('invalid-field', 'valid-field');
            }
        });
    } else {
        console.error("Initialization failed. Ensure elements with IDs 'login-form', 'email', 'password', and 'error-box' exist.");
    }
});
