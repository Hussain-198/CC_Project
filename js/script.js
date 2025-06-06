
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
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
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Fetch and display concerts
fetch("../assets/json/details.json")
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        let displayedConcerts = 0;
        const upcomingConcerts = data.filter(concert => new Date(concert.date) >= new Date());

        const displayConcerts = (startIndex, count) => {
            for (let i = startIndex; i < Math.min(startIndex + count, upcomingConcerts.length); i++) {
                const concert = upcomingConcerts[i];
                createConcertCard(concert, i);
            }
            displayedConcerts += count;
            // getAs();
        };

        // Display the first 4 concerts on page load
        displayConcerts(0, 4);

        const viewBtn = document.getElementById("viewBtn");
        
        if(upcomingConcerts.length>4){
            viewBtn.style.display = "block";
        }
        else{
            viewBtn.style.display = "none";
        }

        if (viewBtn) {
            viewBtn.addEventListener("click", () => {
                displayConcerts(displayedConcerts, 4);
                if (displayedConcerts >= upcomingConcerts.length) {
                    viewBtn.style.display = 'none';
                }
            });
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

// Function to create a concert card
function createConcertCard(concert, index) {
    const div = document.createElement("div");
    div.className = "concert-card";
    div.innerHTML = `
        <div class="card" style="width: 18rem;">
            <img class="card-img-top img-fluid" src="../assets/images/img_${concert.artist.split(" ").join("")}.jpeg" alt="${concert.artist} photo not found">
            <div class="card-body">
                <div id="titleText">
                    <div>
                        <h5 class="card-title" id="artistName${index}">${concert.artist}</h5>
                    </div>
                </div>
                <h6 id="concertName${index}">${concert.venue}</h6>
                <p class="card-text date-text">
                    <img id="calender-icon" src="../assets/images/ico_calender_icon.png" alt="Calendar icon"> ${concert.date}
                </p>
                <p class="card-text">
                    <img id="location-icon" src="../assets/images/ico_location_icon.png" alt=""> ${concert.city}
                </p>
                <a class="btn btn-primary">Book tickets</a>
            </div>
        </div>`;
    document.querySelector(".concertCards").appendChild(div);
    div.addEventListener('click',()=>{
        localStorage.setItem("artistName", concert.artist);
        localStorage.setItem('id',concert.id);
        const loggedin = localStorage.getItem("isLoggedin") === "true";
        window.location.href = loggedin ? '../html/eventdetails.html' : '../html/login.html';
    })


}

const hamburger = document.getElementById("hamburger");
const popupMenu = document.getElementById("popupMenu");
const popupLogoutButton = document.getElementById("popupLogoutButton");
const body = document.body;

if (hamburger) {
    hamburger.addEventListener("click", () => {
        popupMenu.classList.toggle("active");
        body.classList.toggle("menu-open");
    });
}

document.addEventListener("click", (event) => {
    if (popupMenu && !popupMenu.contains(event.target) && !hamburger.contains(event.target)) {
        popupMenu.classList.remove("active");
        body.classList.remove("menu-open");
    }
});

onAuthStateChanged(auth, async (user) => {
    const loginLink = document.getElementById("loginLink");
    const myTicketsNav = document.getElementById("popupMyTickets");
    const usernameDisplay = document.getElementById("usernameDisplay");
    const popupLogoutButton = document.getElementById("popupLogoutButton");

    const isLoggedIn = user !== null;

    if (isLoggedIn) {
        const currentUserEmail = user.email;

        try {
            // Query Supabase for the username
            const { data, error } = await supabase
                .from('users') 
                .select('username')
                .eq('email', currentUserEmail)
                .single(); // Use `.single()` if you expect only one row to match

            if (error) {
                console.error("Error fetching username from Supabase:", error.message);
                usernameDisplay.textContent = "Welcome!";
            } else if (data) {
                const username = data.username;
                usernameDisplay.style.display = "block";
                usernameDisplay.textContent = `Welcome, ${username}!`;

                // Storing username for later use
                localStorage.setItem("username", username);
            }
        } catch (error) {
            console.error("Unexpected error:", error);
        }

        loginLink.style.display = "none";
        myTicketsNav.style.display = "block";

        popupLogoutButton.style.display = "block";
        popupLogoutButton.addEventListener("click", () => {
            signOut(auth).then(() => {
                localStorage.removeItem("isLoggedin");
                localStorage.removeItem("email");
                localStorage.removeItem("username");
                window.location.href = "../index.html";
            }).catch((error) => {
                console.error("Error signing out: ", error);
            });
        });
    } else {
        myTicketsNav.style.display = "none";
        usernameDisplay.style.display = "none";
        loginLink.style.display = "block";

        myTicketsNav.textContent = "Log In";
        myTicketsNav.addEventListener("click", () => {
            window.location.href = "../html/login.html";
        });
    }
});


// function getAs() {
//     const allAnchors = document.querySelectorAll(".card-body a");
//     allAnchors.forEach(anchor => {
//         anchor.addEventListener("click", () => {
//             const artistName = anchor.parentElement.querySelector("h5").textContent.split(" ")[0];
//             localStorage.setItem("artistName", artistName);
//             const loggedin = localStorage.getItem("isLoggedin") === "true";
//             window.location.href = loggedin ? '../html/eventdetails.html' : '../html/login.html';
//         });
//     });
// }

document.getElementById("search-container")?.addEventListener("click", () => {
    window.location.href = "../html/results.html";
});

if (hamburger) {
    hamburger.addEventListener("click", () => {
        hamburger.style.color = "#333333";
    });
}
