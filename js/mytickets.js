import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

document.addEventListener("DOMContentLoaded", async function () {
    // Getting user mail id from localstorage
    const currentUserEmail = localStorage.getItem("email");

    if (!currentUserEmail) {
        window.location.href = "/login.html"; 
        return;
    }

    const ticketsContainer = document.getElementById("ticketsContainer");

    
    const supabaseUrl = 'https://tucnfihoexxepyafqfsw.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1Y25maWhvZXh4ZXB5YWZxZnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzM3MTMsImV4cCI6MjA0ODgwOTcxM30.f1X1ss__ak0Gsp3yfd81WVoGd_T18efO-VWwp4A5Zas';  // Replace with your Supabase API key
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // Fetch tickets from Supabase where the user_email matches the logged-in user's email
        const { data: userTickets, error } = await supabase
            .from('tickets') // Table name
            .select('*') // Select all columns
            .eq('user_email', currentUserEmail) // Filter tickets by user_email
            .order('created_at', { ascending: false }); // Order by date (most recent first)

        if (error) {
            throw error;
        }

        // If there are tickets, displaying them
        if (userTickets.length > 0) {
            userTickets.forEach(ticket => {
                const eventDetails = {
                    title: ticket.event_title,
                    description: ticket.event_description,
                    date: ticket.event_date,
                    venue: ticket.event_venue,
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
                    <p>Name: ${ticket.username}</p>
                    <p>Email: ${ticket.user_email}</p>
                    <p>Amount: ₹${ticket.total_amount}</p>
                    <p>Selected Category: ${ticket.selected_category}</p>
                    <p>Tickets Count: ${ticket.ticket_count}</p>
                `;

                eventCard.querySelector(".card-body").appendChild(ticketItem);
                ticketsContainer.appendChild(eventCard);
            });
        } else { 
            ticketsContainer.innerHTML = "<p>No tickets found. Please purchase tickets to see them here.</p>"; // If there are no tickets, displaying a message
        }
    } catch (error) {
        console.error("Error fetching tickets from Supabase:", error);
        ticketsContainer.innerHTML = "<p>There was an error fetching your tickets. Please try again later.</p>";
    }
});
