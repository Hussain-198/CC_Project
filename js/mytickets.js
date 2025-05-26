// import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

document.addEventListener("DOMContentLoaded", async function () {
    
    const currentUserEmail = localStorage.getItem("email");
    // console.log(currentUserEmail);
    

    if (!currentUserEmail) {
        window.location.href = "/login.html"; 
        return;
    }

    const ticketsContainer = document.getElementById("ticketsContainer");

    // // Initialize Supabase client
    // const supabaseUrl = 'https://tucnfihoexxepyafqfsw.supabase.co';  // Replace with your Supabase URL
    // const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1Y25maWhvZXh4ZXB5YWZxZnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzM3MTMsImV4cCI6MjA0ODgwOTcxM30.f1X1ss__ak0Gsp3yfd81WVoGd_T18efO-VWwp4A5Zas';  // Replace with your Supabase API key
    
    // const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const response = await fetch(`http://localhost:8080/api/tickets/user/${currentUserEmail}`);
        if (!response.ok) {
            throw new Error("Failed to fetch tickets");
        }

        const userTickets = await response.json();

        if (userTickets.length > 0) {
            userTickets.forEach(ticket => {
                console.log(ticket.userEmail);
                
                const eventDetails = {
                    title: ticket.eventTitle,
                    description: ticket.eventDescription,
                    date: ticket.eventDate,
                    venue: ticket.eventVenue,
                };

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

                const ticketItem = document.createElement("div");
                ticketItem.className = "ticket-item p-2 border rounded mb-2";
                ticketItem.innerHTML = `
                    <p><strong>Ticket #${ticket.id}</strong></p>
                    <p>Email: ${ticket.userEmail}</p>
                    <p>Amount: ₹${ticket.totalAmount}</p>
                    <p>Selected Category: ${ticket.selectedCategory}</p>
                    <p>Tickets Count: ${ticket.ticketCount}</p>
                `;

                eventCard.querySelector(".card-body").appendChild(ticketItem);
                ticketsContainer.appendChild(eventCard);
            });
        } else {
            ticketsContainer.innerHTML = "<p>No tickets found. Please purchase tickets to see them here.</p>";
        }
    } catch (error) {
        console.error("Error fetching tickets from backend:", error);
        ticketsContainer.innerHTML = "<p>There was an error fetching your tickets. Please try again later.</p>";
    }

});
