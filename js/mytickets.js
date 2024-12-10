document.addEventListener("DOMContentLoaded", function () {
    // Get current user email from localStorage
    const currentUserEmail = localStorage.getItem("email");
    // const email = localStorage.getItem("email");
    const username = localStorage.getItem(currentUserEmail)    
    const ticketsContainer = document.getElementById("ticketsContainer");
    const userName = document.getElementById("userName");

console.log(username);

    // If no email is found in localStorage, redirect to login page
    if (!currentUserEmail) {
        window.location.href = "/login.html"; // Redirect to login if not logged in
        return;
    }

    // Set the user name based on the email
    // userName.textContent = username;

    // Retrieve tickets from localStorage
    const myTickets = JSON.parse(localStorage.getItem("myTickets")) || [];
    console.log(myTickets);


    
    const userTickets = Object.keys(myTickets);
    console.log(userTickets);
    
    
    // If tickets exist, display them
    if (userTickets.length > 0) {
        userTickets.forEach(entry => {
            
            let EachTicket=myTickets[entry]
            const eventDetails = EachTicket.eventDetails;
            console.log(eventDetails);
            

            // Create a card for each event
            const eventCard = document.createElement("div");
            eventCard.className = "card mb-3";
            
            eventCard.innerHTML = `
                <div class="card-header">
                    <h3>${eventDetails.title}</h3>
                    <p>${eventDetails.date || "TBD"} at ${eventDetails.venue || "TBD"}</p>
                </div>
                <div class="card-body">
                    <p>${eventDetails.description}</p>
                    <h5>Tickets:</h5>
                </div>
            `;

            const ticketDetails = EachTicket.tickets;



            // Add tickets to the card
            const ticketsList = document.createElement("div");
            ticketDetails.forEach(ticket => {
                const ticketItem = document.createElement("div");
                ticketItem.className = "ticket-item p-2 border rounded mb-2";
                ticketItem.innerHTML = `
                    <p><strong>Ticket #${ticket.ticketNo}</strong></p>
                    <p>Name: ${ticket.firstName} ${ticket.lastName}</p>
                    <p>Email: ${ticket.email}</p>
                    <p>Phone: ${ticket.phone}</p>
                `;
                ticketsList.appendChild(ticketItem);
            });

            eventCard.querySelector(".card-body").appendChild(ticketsList);
            ticketsContainer.appendChild(eventCard);
        });
    } else {
        ticketsContainer.innerHTML = "<p>No tickets found. Please purchase tickets to see them here.</p>";
    }
});

    