
const firebaseConfig = {
    apiKey: "AIzaSyBTrJ8hWx5NuUTGnJx5hD3Ps5-7m92KWUs",
    authDomain: "sample-firebase-ai-app-b83c0.firebaseapp.com",
    projectId: "sample-firebase-ai-app-b83c0",
    storageBucket: "sample-firebase-ai-app-b83c0.appspot.com",
    messagingSenderId: "144531331956",
    appId: "1:144531331956:web:eac7601b172cf9fcadea21"
};


import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth();

const resultsContainer = document.getElementById('resultsContainer');
const searchBox = document.getElementById('searchBox');
const filterSelect = document.getElementById('filterSelect');
const genreFilter = document.getElementById('genreFilter');

// Function to fetch and filter data
function fetchAndFilterData() {
<<<<<<< HEAD
=======
    
>>>>>>> 9ff99cf81519c2633b11a8f72ae77a4aee39d3db
    const query = searchBox.value.toLowerCase();
    const filter = document.getElementById('filterSelect').value; 
    const selectedGenre = genreFilter.value.toLowerCase();

<<<<<<< HEAD
    console.log("Selected filter:", filter); 
    console.log("Search query:", query);

    const params = new URLSearchParams();

    if (query) {
        if (filter === 'artist') {
            params.append('artist', query);
        } else if (filter === 'venue') {
            params.append('city', query);
        } else if (filter === 'genre') {
            params.append('genre', query);
        }
    }

    if (selectedGenre !== 'all') {
        params.append('genre', selectedGenre);
    }

    const url = `http://localhost:8080/api/concerts/search?${params.toString()}`;
    console.log("Fetching:", url);

    resultsContainer.innerHTML = '';

    fetch(url)
=======
   
    resultsContainer.innerHTML = '';

   
    fetch('../assets/json/details.json')
>>>>>>> 9ff99cf81519c2633b11a8f72ae77a4aee39d3db
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
<<<<<<< HEAD
            const filteredResults = data.filter(item => {
                const eventDate = new Date(item.date);
                const currentDate = new Date();
                return eventDate >= currentDate;
=======
            // Apply filters based on genre
            const filteredResults = data.filter(item => {
                const eventDate = new Date(item.date); // Parse the event date
                const currentDate = new Date(); // Current date

                // Ensure only upcoming events are included
                const isUpcoming = eventDate >= currentDate;

                // Check if it matches the search
                const matchesSearch =
                    (filter === 'artist' && item.artist.toLowerCase().includes(query)) ||
                    (filter === 'venue' && item.venue.toLowerCase().includes(query)) ||
                    (filter === 'genre' && item.genre.toLowerCase().includes(query));

                // Check if it matches the selected genre
                const matchesGenre = selectedGenre === 'all' || item.genre.toLowerCase() === selectedGenre;

                return matchesSearch && matchesGenre && isUpcoming;
>>>>>>> 9ff99cf81519c2633b11a8f72ae77a4aee39d3db
            });

            showResults(filteredResults);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            resultsContainer.innerHTML = '<p>Error fetching results.</p>';
        });
}


<<<<<<< HEAD



// Event listener for search form submission
=======
>>>>>>> 9ff99cf81519c2633b11a8f72ae77a4aee39d3db
document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();
    fetchAndFilterData();
});

// genre filter
genreFilter.addEventListener('change', fetchAndFilterData);

// results display
function showResults(filteredResults) {
    if (filteredResults.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
    } else {
        filteredResults.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item', 'card', 'mb-3');
            resultItem.innerHTML = `
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${item.imageUrl}" class="img-fluid rounded-start" alt="${item.artist}">
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

   
        attachBookTicketEvents();
    }
}

// Function to attach click events to "Book tickets" buttons
function attachBookTicketEvents() {
    const allBookButtons = document.querySelectorAll('.book-ticket');
    allBookButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const eventId = event.target.getAttribute('data-event-id');
            console.log('Stored event ID:', eventId);

<<<<<<< HEAD
            // Storing event ID in localStorage
=======
            
>>>>>>> 9ff99cf81519c2633b11a8f72ae77a4aee39d3db
            localStorage.setItem('id', eventId);

            // User's authentication
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    window.location.href = '../html/eventdetails.html';
                } else {
                    window.location.href = '../html/login.html';
                }
            });
        });
    });
}
