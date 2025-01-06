// Importing necessary libraries
// Import Firebase and Supabase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBTrJ8hWx5NuUTGnJx5hD3Ps5-7m92KWUs",
    authDomain: "sample-firebase-ai-app-b83c0.firebaseapp.com",
    projectId: "sample-firebase-ai-app-b83c0",
    storageBucket: "sample-firebase-ai-app-b83c0.appspot.com",
    messagingSenderId: "144531331956",
    appId: "1:144531331956:web:eac7601b172cf9fcadea21"
};

// Initialize Supabase (with your URL and API key)
const supabaseUrl = 'https://tucnfihoexxepyafqfsw.supabase.co';  // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1Y25maWhvZXh4ZXB5YWZxZnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzM3MTMsImV4cCI6MjA0ODgwOTcxM30.f1X1ss__ak0Gsp3yfd81WVoGd_T18efO-VWwp4A5Zas';  // Replace with your Supabase API key

// Initialize Firebase & Supabase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const supabase = createClient(supabaseUrl, supabaseKey);

// Modal functionality
const modal = document.getElementById("myModal");
const modalMessage = document.getElementById("modalMessage");
const span = document.getElementsByClassName("close")[0];

document.getElementById("signup-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");
    const usernameError = document.getElementById("usernameError");

    // Clear previous error messages
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";
    usernameError.textContent = "";

    // Validate input fields
    let valid = true;

    if (username === "") {
        usernameError.textContent = "Username is required!";
        valid = false;
    } else if (/\s/.test(username)) { // Check for spaces in the username
        usernameError.textContent = "Username cannot contain spaces!";
        valid = false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
        emailError.textContent = "Please enter a valid email address.";
        valid = false;
    }

    if (password === "") {
        passwordError.textContent = "Password is required!";
        valid = false;
    } else if (password.length > 30) {
        passwordError.textContent = "Password must not exceed 30 characters.";
        valid = false;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#?$%^&*])[A-Za-z\d!@#$?%^&*\s]{8,}$/.test(password)) {
        passwordError.textContent = "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, a special character, and can include spaces.";
        valid = false;
    }

    if (password !== confirmPassword) {
        confirmPasswordError.textContent = "Passwords do not match!";
        valid = false;
    }

    // If not valid, return early
    if (!valid) {
        return;
    }

    // Create user in Firebase
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // After user is created, store details in Supabase
            const user = userCredential.user;

            console.log("Firebase User Created: ", user);

            // Store user in Supabase `users` table
            supabase
                .from('users')
                .insert([
                    { username: username, email: email }
                ])
                .then(response => {
                    if (response.error) {
                        console.error('Error storing user in Supabase:', response.error.message);
                    } else {
                        console.log('User stored in Supabase:', response.data);
                        showModal("Registration Successful!");
                        setTimeout(() => {
                            window.location.href = "../index.html"; // Redirect after a brief moment
                        }, 1000); // 1 second delay for modal
                        localStorage.setItem(email, username);
                        localStorage.setItem("email", email);
                    }
                })
                .catch(error => {
                    console.error('Error inserting data into Supabase:', error);
                });

        })
        .catch((error) => {
            const errorMessage = error.message;
            if (errorMessage.includes("email")) {
                emailError.textContent = errorMessage; // Show error in email span
            } else {
                passwordError.textContent = errorMessage; // Show error in password span
            }
        });
});

// Toggle password visibility
document.getElementById("togglePassword").addEventListener("click", function () {
    const passwordField = document.getElementById("password");
    togglePasswordVisibility(passwordField, this);
});

document.getElementById("toggleConfirmPassword").addEventListener("click", function () {
    const confirmPasswordField = document.getElementById("confirm-password");
    togglePasswordVisibility(confirmPasswordField, this);
});

function togglePasswordVisibility(field, icon) {
    if (field.type === "password") {
        field.type = "text";
        icon.textContent = "Hide"; // Change to a different icon when visible
    } else {
        field.type = "password";
        icon.textContent = "Show"; // Change back to eye icon when hidden
    }
}

function showModal(message) {
    modal.style.display = 'block'; // Make modal visible
    modalMessage.textContent = message;

    setTimeout(() => {
        modal.querySelector('.modal-content').style.transform = 'translateX(0)';
    }, 10); // Small delay to trigger the CSS transition
}

span.onclick = function () {
    hideModal();
}

window.onclick = function (event) {
    if (event.target === modal) {
        hideModal();
    }
}

function hideModal() {
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.transform = 'translateX(-100%)';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 500);
}
