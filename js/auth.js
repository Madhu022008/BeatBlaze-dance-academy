/**
 * auth.js
 * Handles User Authentication securely (mock implementation using localStorage)
 */

class AuthService {
    constructor() {
        this.usersKey = 'beatblaze_users';
        this.currentUserKey = 'beatblaze_current_user';
    }

    // Initialize users array if it doesn't exist
    init() {
        if (!localStorage.getItem(this.usersKey)) {
            localStorage.setItem(this.usersKey, JSON.stringify([]));
        }
    }

    // Register a new user
    signup(name, email, password) {
        this.init();
        const users = JSON.parse(localStorage.getItem(this.usersKey));
        
        // Check if user exists
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'Email already registered.' };
        }

        const newUser = { id: Date.now(), name, email, password };
        users.push(newUser);
        localStorage.setItem(this.usersKey, JSON.stringify(users));

        // Auto login
        this.login(email, password);
        return { success: true };
    }

    // Login user
    login(email, password) {
        this.init();
        const users = JSON.parse(localStorage.getItem(this.usersKey));
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Store session
            const session = { id: user.id, name: user.name, email: user.email };
            localStorage.setItem(this.currentUserKey, JSON.stringify(session));
            return { success: true };
        }
        
        return { success: false, message: 'Invalid credentials.' };
    }

    // Logout user
    logout() {
        localStorage.removeItem(this.currentUserKey);
        window.location.href = 'index.html';
    }

    // Get current logged-in user
    getCurrentUser() {
        const userStr = localStorage.getItem(this.currentUserKey);
        return userStr ? JSON.parse(userStr) : null;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.getCurrentUser() !== null;
    }

    // Protect routes
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
        }
    }

    // Redirect if already logged in (for login/signup pages)
    requireGuest() {
        if (this.isAuthenticated()) {
            window.location.href = 'dashboard.html';
        }
    }
}

// Global Auth Instance
const auth = new AuthService();
