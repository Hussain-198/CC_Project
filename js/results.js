document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    const query = document.getElementById('searchBox').value.toLowerCase();
    const resultsContainer = document.getElementById('resultsContainer');

    // Clear previous results
    resultsContainer.innerHTML = '';

    // Fetching data from the JSON file
    fetch('../assets/json/details.json') // Ensure the path is correct
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Filtering results based on the search query
            const filteredResults = data.filter(item =>
                item.artist.toLowerCase().includes(query) ||
                item.venue.toLowerCase().includes(query)
            );

            // Displaying results
            if (filteredResults.length === 0) {
                resultsContainer.innerHTML = '<p>No results found.</p>';
            } else {
                const loggedin = localStorage.getItem("isLoggedin") === "true"; // Check if user is logged in
                filteredResults.forEach(item => {
                    const resultItem = document.createElement('div');
                    resultItem.classList.add('result-item', 'card', 'mb-3'); // Bootstrap classes for styling
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
                                    <a class="btn btn-primary" href="${loggedin ? 'index.html' : 'login.html'}">Book tickets</a>
                                </div>
                            </div>
                        </div>
                    `;
                    resultsContainer.appendChild(resultItem);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            resultsContainer.innerHTML = '<p>Error fetching results.</p>';
        });
});
