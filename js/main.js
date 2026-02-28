/**
 * main.js
 * Handles UI interactions, navbar state, and form submissions.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar State Updates ---
    const updateNavbar = () => {
        const authButtons = document.getElementById('authButtons');
        if (!authButtons) return;

        if (auth.isAuthenticated()) {
            const user = auth.getCurrentUser();
            authButtons.innerHTML = `
                <span style="margin-right: 15px; font-weight: bold;">Welcome, ${user.name.split(' ')[0]}</span>
                <a href="dashboard.html" class="btn btn-secondary" style="padding: 0.5rem 1rem;">Dashboard</a>
                <button onclick="auth.logout()" class="btn btn-primary" style="padding: 0.5rem 1rem;">Logout</button>
            `;
        } else {
            authButtons.innerHTML = `
                <a href="login.html" class="btn btn-secondary" style="padding: 0.5rem 1rem;">Login</a>
                <a href="signup.html" class="btn btn-primary" style="padding: 0.5rem 1rem;">Sign Up</a>
            `;
        }
    };

    updateNavbar();

    // --- Signup Form Handler ---
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        auth.requireGuest(); // Redirect if already logged in

        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMsg = document.getElementById('errorMsg');

            const result = auth.signup(name, email, password);

            if (result.success) {
                window.location.href = 'dashboard.html';
            } else {
                errorMsg.style.display = 'block';
                errorMsg.textContent = result.message;
            }
        });
    }

    // --- Login Form Handler ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        auth.requireGuest(); // Redirect if already logged in

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMsg = document.getElementById('errorMsg');

            const result = auth.login(email, password);

            if (result.success) {
                window.location.href = 'dashboard.html';
            } else {
                errorMsg.style.display = 'block';
                errorMsg.textContent = result.message;
            }
        });
    }

    // --- Dashboard Specific Logic ---
    const dashboardContent = document.getElementById('dashboardContent');
    if (dashboardContent) {
        auth.requireAuth(); // Redirect if NOT logged in

        const user = auth.getCurrentUser();

        // Populate dashboard with user info
        const userNameDisplays = document.querySelectorAll('.user-name-display');
        userNameDisplays.forEach(el => el.textContent = user.name);

        const userEmailDisplay = document.querySelector('.user-email-display');
        if (userEmailDisplay) userEmailDisplay.textContent = user.email;
    }
});
