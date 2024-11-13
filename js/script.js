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
    const displayConcerts = (startIndex, count) => {
      for (let i = startIndex; i < Math.min(startIndex + count, data.length); i++) {
        createConcertCard(data[i], i);
      }
      displayedConcerts += count;
      getAs();
    };
    displayConcerts(displayedConcerts, 4);

    let viewBtn = document.getElementById("viewBtn");
    viewBtn.addEventListener("click", () => {
      displayConcerts(displayedConcerts, 4);
      if (displayedConcerts >= data.length) {
        viewBtn.style.display = 'none';
      }
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

// Function to create a concert card
function createConcertCard(concert, index) {
  let div = document.createElement("div");
  div.className = "concert-card";
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
        <a class="btn btn-primary">Book tickets</a>
      </div>
    </div>`;
  document.querySelector(".concertCards").appendChild(div);
}

// User Authentication and Conditional Navigation
onAuthStateChanged(auth, (user) => {
  const userGreeting = document.getElementById("userGreeting");
  const authButtons = document.getElementById("authButtons");
  const usernameDisplay = document.getElementById("usernameDisplay");

  if (user) {
    localStorage.setItem("isLoggedin", "true");
    const email = localStorage.getItem("email");
    const username = localStorage.getItem(email);
    usernameDisplay.textContent = `Welcome, ${username}!`;
    userGreeting.style.display = "block";
    authButtons.style.display = "none";

    // Logout functionality
    document.getElementById("logoutButton").addEventListener("click", () => {
      signOut(auth).then(() => {
        localStorage.removeItem("isLoggedin");
        window.location.href = "index.html";
      }).catch((error) => {
        console.error("Error signing out: ", error);
      });
    });
  } else {
    localStorage.removeItem("isLoggedin");
    userGreeting.style.display = "none";
    authButtons.style.display = "block";
  }
  getAs(); // Re-run getAs to ensure correct links are set
});

function getAs() {
  let allAnchors = document.querySelectorAll(".card-body a");
  allAnchors.forEach(anchor => {
    anchor.addEventListener("click", () => {
      localStorage.setItem("artistName", anchor.parentElement.querySelector("h5").textContent.split(" ")[0]);
      const loggedin = localStorage.getItem("isLoggedin") === "true"; // Check updated login status
      window.location.href = loggedin ? '../html/eventdetails.html' : '../html/login.html';
    });
  });
}

document.getElementById("search-container").addEventListener("click", () => {
  window.location.href = "../html/results.html";
})