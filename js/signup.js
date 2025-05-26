
const modal = document.getElementById("myModal");
const modalMessage = document.getElementById("modalMessage");
const span = document.getElementsByClassName("close")[0];

document.getElementById("signup-form").addEventListener("submit", function (event) {
    event.preventDefault();

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

    if (!valid) return;

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
            }
        });
});

// Toggle password visibility
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
