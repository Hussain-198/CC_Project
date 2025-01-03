// Firebase config and initialization
const firebaseConfig = {
    apiKey: "AIzaSyBTrJ8hWx5NuUTGnJx5hD3Ps5-7m92KWUs",
    authDomain: "sample-firebase-ai-app-b83c0.firebaseapp.com",
    projectId: "sample-firebase-ai-app-b83c0",
    storageBucket: "sample-firebase-ai-app-b83c0.appspot.com",
    messagingSenderId: "144531331956",
    appId: "1:144531331956:web:eac7601b172cf9fcadea21"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth();

/// Event listener for search form submission
document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const query = document.getElementById('searchBox').value.toLowerCase();
    const filter = document.getElementById('filterSelect').value;
    const genreFilter = document.getElementById('genreFilter').value.toLowerCase(); // Genre filter
    const resultsContainer = document.getElementById('resultsContainer');

    // Clear previous results
    resultsContainer.innerHTML = '';

    // Fetch data from JSON
    fetch('../assets/json/details.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Apply filters based on selected criteria, search query, genre, and date
            const filteredResults = data.filter(item => {
                const eventDate = new Date(item.date); // Parse the event date
                const currentDate = new Date(); // Current date
                
                // Ensure only upcoming events are included
                const isUpcoming = eventDate >= currentDate; 

                const matchesSearch =
                    (filter === 'artist' && item.artist.toLowerCase().includes(query)) ||
                    (filter === 'venue' && item.venue.toLowerCase().includes(query)) ||
                    (filter === 'genre' && item.genre.toLowerCase().includes(query));

                const matchesGenre = genreFilter === 'all' || item.genre.toLowerCase() === genreFilter;

                return matchesSearch && matchesGenre && isUpcoming;
            });

            // Display results
            if (filteredResults.length === 0) {
                resultsContainer.innerHTML = '<p>No results found.</p>';
            } else {
                // Display each filtered result
                filteredResults.forEach(item => {
                    const resultItem = document.createElement('div');
                    resultItem.classList.add('result-item', 'card', 'mb-3');
                    resultItem.innerHTML = `
                        <div class="row g-0">
                            <div class="col-md-4">
                                <img src="${item.image}" class="img-fluid rounded-start" alt="${item.artist}">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${item.artist}</h5>
                                    <p class="card-text"><strong>Date:</strong> ${item.date}</p>
                                    <p class="card-text"><strong>Venue:</strong> ${item.venue}, ${item.city}</p>
                                    <p class="card-text"><strong>Genre:</strong> ${item.genre}</p>
                                    <a href="#" class="btn btn-primary book-ticket" data-event-id="${item.id}">Book tickets</a>
                                </div>
                            </div>
                        </div>
                    `;
                    resultsContainer.appendChild(resultItem);
                });

                // Attach click event to each "Book tickets" button
                attachBookTicketEvents(filteredResults);  // Pass filteredResults to the function
            }
            
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            resultsContainer.innerHTML = '<p>Error fetching results.</p>';
        });
});

// Function to attach click event to each "Book tickets" button
function attachBookTicketEvents(filteredResults) {
    const allBookButtons = document.querySelectorAll('.book-ticket');
    allBookButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Store the ID of the clicked event
            const eventId = event.target.getAttribute('data-event-id');  // Retrieve event ID
            console.log('Stored event ID:', eventId); // Log the event ID for debugging

            // Store the event ID in localStorage
            localStorage.setItem('id', eventId);

            // Check the user's authentication state before redirecting
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    // If the user is logged in, redirect to event details page
                    window.location.href = '../html/eventdetails.html';
                } else {
                    // If the user is not logged in, redirect to login page
                    window.location.href = '../html/login.html';
                }
            });
        });
    });
}