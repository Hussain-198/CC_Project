// Event listener for search form submission
document.getElementById('searchForm').addEventListener('submit', function(event) {
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
            // Apply filters based on selected criteria and search query
            const filteredResults = data.filter(item => {
                const matchesSearch = (filter === 'artist' && item.artist.toLowerCase().includes(query)) ||
                                      (filter === 'venue' && item.venue.toLowerCase().includes(query)) ||
                                      (filter === 'genre' && item.genre.toLowerCase().includes(query));
                
                const matchesGenre = genreFilter === 'all' || item.genre.toLowerCase() === genreFilter;

                return matchesSearch && matchesGenre;
            });

            // Display results
            if (filteredResults.length === 0) {
                resultsContainer.innerHTML = '<p>No results found.</p>';
            } else {
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
                                    <p class="card-text"><strong>Ticket Price:</strong> ₹${item.ticket_price}</p>
                                    <p class="card-text"><strong>Genre:</strong> ${item.genre}</p>
                                    <a class="btn btn-primary book-ticket">Book tickets</a>
                                </div>
                            </div>
                        </div>
                    `;
                    resultsContainer.appendChild(resultItem);
                });

                // Attach click event to each "Book tickets" button
                attachBookTicketEvents();
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            resultsContainer.innerHTML = '<p>Error fetching results.</p>';
        });
});

// Function to dynamically filter by genre
function filterByGenre() {
    document.getElementById('searchForm').dispatchEvent(new Event('submit'));
}

// Function to attach click event to each "Book tickets" button
function attachBookTicketEvents() {
    const allBookButtons = document.querySelectorAll('.book-ticket');
    allBookButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const artistName = event.target.closest('.card-body').querySelector('h5').textContent.split(" ")[0];
            localStorage.setItem("artistName", artistName);

            const loggedin = localStorage.getItem("isLoggedin") === "true"; // Check login status
            window.location.href = loggedin ? '../html/eventdetails.html' : '../html/login.html';
        });
    });
}
    