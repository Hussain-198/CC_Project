
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTrJ8hWx5NuUTGnJx5hD3Ps5-7m92KWUs",
  authDomain: "sample-firebase-ai-app-b83c0.firebaseapp.com",
  projectId: "sample-firebase-ai-app-b83c0",
  storageBucket: "sample-firebase-ai-app-b83c0.appspot.com",
  messagingSenderId: "144531331956",
  appId: "1:144531331956:web:eac7601b172cf9fcadea21"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Fetching the data
fetch("../assets/json/details.json")
  .then(response => {
    // Check if the response is ok
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json(); // Parse JSON data
  })
  .then(data => {
    let displayedConcerts = 0; // Track how many concerts are displayed

    // Function to create concert cards
    const displayConcerts = (startIndex, count) => {
      for (let i = startIndex; i < Math.min(startIndex + count, data.length); i++) {
        createConcertCard(data[i], i);
      }
      displayedConcerts += count; // Update the count of displayed concerts
    };

    // Display the first 4 concerts initially
    displayConcerts(displayedConcerts, 4);

    // Set up the button to load more concerts
    let viewBtn = document.getElementById("viewBtn");
    viewBtn.addEventListener("click", () => {
      displayConcerts(displayedConcerts, 4); // Load the next 4 concerts
      if (displayedConcerts >= data.length) {
        viewBtn.style.display = 'none'; // Hide the button if there are no more concerts
      }
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
// Function to create a concert card
function createConcertCard(concert, index) {
  const loggedin = localStorage.getItem("isLoggedin") === "true"; // Check if user is logged in
  let div = document.createElement("div");
  div.className = "concert-card"; // Optional: add a class for styling

  div.innerHTML = `
    <div class="card" style="width: 18rem;">
      <img class="card-img-top img-fluid" src="../assets/images/${concert.artist.split(" ").join("")}.jpeg" alt="${concert.artist} photo not found">
      <div class="card-body">
        <div id="titleText">
          <div>
            <h5 class="card-title" id="artistName${index}">${concert.artist}</h5>
          </div>
          <div>
            <h5>₹${concert.ticket_price}</h5>
          </div>
        </div>
        <h6 id="concertName${index}">${concert.venue}</h6>
        <p class="card-text date-text">
          <img id="calender-icon" src="../assets/images/1579797_calendar_calender_date_icon.png" alt="Calendar icon"> ${concert.venue} | ${concert.date}
        </p>
        <p class="card-text">
          <img id="location-icon" src="../assets/images/352521_location_on_icon.png" alt=""> ${concert.city}
        </p>
        <a class="btn btn-primary" href="${loggedin ? 'index.html' : 'login.html'}">Book tickets</a>
      </div>
    </div>`;

  document.querySelector(".concertCards").appendChild(div);
}

document.getElementById("searchForm").addEventListener("submit", function (event) {
  const searchTerm = document.getElementById("searchBox").value;
  if (!searchTerm) {
    event.preventDefault(); // Prevent submission if the input is empty
    alert("Please enter a search term.");
  }
});

let searchBox = document.getElementById("search-container");
searchBox.addEventListener("click", () => {
  window.location.href = "results.html"
})

// Check user authentication state
onAuthStateChanged(auth, (user) => {
  const userGreeting = document.getElementById("userGreeting");
  const authButtons = document.getElementById("authButtons");
  const usernameDisplay = document.getElementById("usernameDisplay");

  if (user) {
    // User is signed in

    const email = localStorage.getItem("email");
    const username = localStorage.getItem(email);
    usernameDisplay.textContent = `Welcome, ${username}!`;
    userGreeting.style.display = "block"; // Show greeting
    authButtons.style.display = "none"; // Hide auth buttons

    // Logout functionality
    document.getElementById("logoutButton").addEventListener("click", () => {
      signOut(auth).then(() => {
        // Sign-out successful.
        localStorage.removeItem("isLoggedin");
        window.location.href = "index.html"; // Redirect to home after logout
      }).catch((error) => {
        console.error("Error signing out: ", error);
      });
    });
  } else {
    // No user is signed in
    userGreeting.style.display = "none"; // Hide greeting
    authButtons.style.display = "block"; // Show auth buttons
  }
});
