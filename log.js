// DOM Elements
const signupButton = document.getElementById("signup-button");
const loginButton = document.getElementById("login-button");
const signupModal = document.getElementById("signup-modal");
const loginModal = document.getElementById("login-modal");
const signupSubmit = document.getElementById("signup-submit");
const loginSubmit = document.getElementById("login-submit");

// Temporary storage for users (in a real app, use a server)
let users = [];

// Toggle modals for sign-up and login
signupButton.addEventListener("click", () => {
    signupModal.style.display = "block";
    loginModal.style.display = "none"; // Close login modal if open
});

loginButton.addEventListener("click", () => {
    loginModal.style.display = "block";
    signupModal.style.display = "none"; // Close sign-up modal if open
});

// Handle Sign Up
signupSubmit.addEventListener("click", () => {
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    if (username && password) {
        // Check if the user already exists
        if (users.find(user => user.username === username)) {
            alert("Username already exists!");
        } else {
            // Add new user to the users array
            users.push({ username, password });
            alert("Sign up successful!");
            signupModal.style.display = "none"; // Close modal
        }
    } else {
        alert("Please fill in all fields.");
    }
});

// Handle Login
loginSubmit.addEventListener("click", () => {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    if (username && password) {
        // Check if the user exists and password matches
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            alert("Login successful!");
            loginModal.style.display = "none"; // Close modal
        } else {
            alert("Invalid username or password.");
        }
    } else {
        alert("Please fill in all fields.");
    }
});
