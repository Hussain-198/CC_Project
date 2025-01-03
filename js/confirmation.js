import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

document.addEventListener("DOMContentLoaded", function () {
    const paymentDetails = JSON.parse(localStorage.getItem("paymentDetails"));
    const eventDetails = JSON.parse(localStorage.getItem("selectedEvent"));
    const selectedCategory = paymentDetails?.selectedCategory || "Not Specified";

    // Validate payment and event details
    if (!paymentDetails || !eventDetails) {
        console.error("No payment or event details found!");
        alert("Payment or event details are missing. Please try again.");
        window.location.href = "../index.html"; // Redirect to home page
        return;
    }

    // Load Event Details
    document.getElementById("eventTitle").textContent = eventDetails.title;
    document.getElementById("eventDescription").textContent = eventDetails.description;
    const eventImage = document.getElementById("eventImage");
    eventImage.src = eventDetails.image;
    eventImage.style.display = "block";

    // Load Payment Summary
    document.getElementById("totalAmount").textContent = `₹${paymentDetails.totalAmount}`;

    // Display Ticket Summary
    const ticketSummaryContainer = document.getElementById("ticketDetails");
    const ticketCount = paymentDetails.ticketCount || 0;

    const ticketSummaryElement = document.createElement("div");
    ticketSummaryElement.className = "mb-3 p-3 border rounded";
    ticketSummaryElement.innerHTML = `
        <p><strong>Selected Category:</strong> ${selectedCategory}</p>
        <p><strong>Total Tickets Booked:</strong> ${ticketCount}</p>
    `;
    ticketSummaryContainer.appendChild(ticketSummaryElement);

    // Initialize EmailJS
    emailjs.init("6Kg5M-hZ9O2Sxbau7");

    // Initialize Supabase client
    const supabaseUrl = 'https://tucnfihoexxepyafqfsw.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1Y25maWhvZXh4ZXB5YWZxZnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzM3MTMsImV4cCI6MjA0ODgwOTcxM30.f1X1ss__ak0Gsp3yfd81WVoGd_T18efO-VWwp4A5Zas';  // Replace with your Supabase URL;  // Replace with your Supabase API key
 
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Confirm Payment Button
    document.getElementById("confirmPayment").addEventListener("click", async function () {
        const recipientEmail = localStorage.getItem("email");
        const username = localStorage.getItem("username") || "User";

        if (!recipientEmail) {
            alert("No email address found for the recipient.");
            return;
        }

        // Prepare email content
        const emailData = {
            to_email: recipientEmail,
            to_name: username,
            eventTitle: eventDetails.title,
            eventDescription: eventDetails.description,
            eventDate: eventDetails.date || "TBD",
            eventVenue: eventDetails.venue || "TBD",
            selectedCategory: selectedCategory,
            totalAmount: paymentDetails.totalAmount,
            ticketSummary: ticketCount,
        };

        try {
            // Send email using EmailJS
            const response = await emailjs.send("service_zf7m9se", "template_upb839h", emailData);
            console.log("Email sent successfully:", response);

            // Save ticket details to Supabase
            const { data, error } = await supabase
                .from('tickets') // Insert into the 'tickets' table
                .insert([
                    {
                        user_email: recipientEmail,
                        username: username,
                        event_title: eventDetails.title,
                        event_description: eventDetails.description,
                        event_date: eventDetails.date || null,
                        event_venue: eventDetails.venue || null,
                        selected_category: selectedCategory, // Store selected category
                        total_amount: paymentDetails.totalAmount,
                        ticket_count: ticketCount,
                    }
                ]);

            if (error) {
                console.error("Error saving ticket to Supabase:", error);
                alert("There was an issue saving the ticket details. Please try again later.");
            } else {
                console.log("Ticket details saved successfully:", data);
            }

            // Save ticket details to 'myTickets' in localStorage
            let myTickets = JSON.parse(localStorage.getItem("myTickets")) || [];
            myTickets.push({ eventDetails, ticketsCount: ticketCount, selectedCategory });
            localStorage.setItem("myTickets", JSON.stringify(myTickets));

            // Display success message and clear local storage
            alert("Payment Confirmed! Your ticket details have been sent to your email.");
            localStorage.removeItem("paymentDetails");
            window.location.href = "../index.html";
        } catch (error) {
            console.error("Failed to send email or save to Supabase:", error);
            alert("There was an issue processing your payment. Please try again later.");
        }
    });
});
