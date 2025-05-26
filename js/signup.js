<<<<<<< HEAD

=======
// Importing necessary libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';


const firebaseConfig = {
    apiKey: "AIzaSyBTrJ8hWx5NuUTGnJx5hD3Ps5-7m92KWUs",
    authDomain: "sample-firebase-ai-app-b83c0.firebaseapp.com",
    projectId: "sample-firebase-ai-app-b83c0",
    storageBucket: "sample-firebase-ai-app-b83c0.appspot.com",
    messagingSenderId: "144531331956",
    appId: "1:144531331956:web:eac7601b172cf9fcadea21"
};


const supabaseUrl = 'https://tucnfihoexxepyafqfsw.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1Y25maWhvZXh4ZXB5YWZxZnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzM3MTMsImV4cCI6MjA0ODgwOTcxM30.f1X1ss__ak0Gsp3yfd81WVoGd_T18efO-VWwp4A5Zas';  // Replace with your Supabase API key


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const supabase = createClient(supabaseUrl, supabaseKey);

// Modal functionality
>>>>>>> 9ff99cf81519c2633b11a8f72ae77a4aee39d3db
const modal = document.getElementById("myModal");
const modalMessage = document.getElementById("modalMessage");
const span = document.getElementsByClassName("close")[0];

document.getElementById("signup-form").addEventListener("submit", function (event) {
<<<<<<< HEAD
    event.preventDefault();
=======
    event.preventDefault(); 
>>>>>>> 9ff99cf81519c2633b11a8f72ae77a4aee39d3db

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");
    const usernameError = document.getElementById("usernameError");



    emailError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";
    usernameError.textContent = "";

    let valid = true;

    if (username === "") {
        usernameError.textContent = "Username is required!";
        valid = false;
    } else if (/\s/.test(username)) {
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
        passwordError.textContent = "Password must be at least 8 characters long, include uppercase, lowercase, number and special character.";
        valid = false;
    }

    if (password !== confirmPassword) {
        confirmPasswordError.textContent = "Passwords do not match!";
        valid = false;
    }

<<<<<<< HEAD
    if (!valid) return;
=======
    // If not valid, return early
    if (!valid) {
        return;
    }
 
    // Create user in Firebase
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            
            const user = userCredential.user;

            console.log("Firebase User Created: ", user);

           
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
                            window.location.href = "../html/login.html";
                        }, 1000);
                        localStorage.setItem(email, username);
                        localStorage.setItem("email", email);
                    }
                })
                .catch(error => {
                    console.error('Error inserting data into Supabase:', error);
                });
>>>>>>> 9ff99cf81519c2633b11a8f72ae77a4aee39d3db

    fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(msg => { throw new Error(msg); });
            }
            return response.text();
        })
<<<<<<< HEAD
        .then(message => {
            console.log("User signed up:", message);
            showModal("Registration Successful!");
            localStorage.setItem("email", email);
            localStorage.setItem(email, username);
            setTimeout(() => {
                window.location.href = "../index.html";
            }, 1000);
        })
        .catch(error => {
            if (error.message.toLowerCase().includes("email")) {
                emailError.textContent = error.message;
            } else {
                passwordError.textContent = error.message;
=======
        .catch((error) => {
            const errorMessage = error.message;
            if (errorMessage.includes("email")) {
                emailError.textContent = errorMessage; 
            } else {
                passwordError.textContent = errorMessage; 
>>>>>>> 9ff99cf81519c2633b11a8f72ae77a4aee39d3db
            }
        });
});

//Password visibility
document.getElementById("togglePassword").addEventListener("click", function () {
    togglePasswordVisibility(document.getElementById("password"), this);
});
document.getElementById("toggleConfirmPassword").addEventListener("click", function () {
    togglePasswordVisibility(document.getElementById("confirm-password"), this);
});

function togglePasswordVisibility(field, icon) {
    if (field.type === "password") {
        field.type = "text";
        icon.textContent = "Hide";
    } else {
        field.type = "password";
        icon.textContent = "Show";
    }
}

function showModal(message) {
    modal.style.display = 'block';
    modalMessage.textContent = message;
    setTimeout(() => {
        modal.querySelector('.modal-content').style.transform = 'translateX(0)';
    }, 10);
}

span.onclick = function () {
    hideModal();
};
window.onclick = function (event) {
    if (event.target === modal) {
        hideModal();
    }
};
function hideModal() {
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.transform = 'translateX(-100%)';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 500);
}
