document.addEventListener("DOMContentLoaded", function () {
    const myTickets = JSON.parse(localStorage.getItem("myTickets")) || [];
    const ticketsContainer = document.getElementById("ticketsContainer");

    if (myTickets.length > 0) {
        myTickets.forEach(entry => {
            const eventDetails = entry.eventDetails;
            const tickets = entry.tickets;

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

            const ticketsList = document.createElement("div");
            tickets.forEach(ticket => {
                const ticketItem = document.createElement("div");
                ticketItem.className = "p-2 border rounded mb-2";
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
