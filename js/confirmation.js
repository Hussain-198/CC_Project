document.addEventListener("DOMContentLoaded", function () {
    const paymentDetails = JSON.parse(localStorage.getItem("paymentDetails"));
    const eventDetails = JSON.parse(localStorage.getItem("selectedEvent"));

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

    // Display Ticket Summary (Number of Tickets Booked)
    const ticketSummaryContainer = document.getElementById("ticketDetails");
    const ticketCount = paymentDetails.tickets?.length || paymentDetails.ticketCount || 0;

    const ticketSummaryElement = document.createElement("div");
    ticketSummaryElement.className = "mb-3 p-3 border rounded";
    ticketSummaryElement.innerHTML = `
        <p><strong>Total Tickets Booked:</strong> ${ticketCount}</p>
    `;
    ticketSummaryContainer.appendChild(ticketSummaryElement);

    // Initialize EmailJS
    emailjs.init("6Kg5M-hZ9O2Sxbau7");
    
    // console.log(recipientEmail);
    
    
    // console.log(username);
    
    // Confirm Payment Button
    document.getElementById("confirmPayment").addEventListener("click", async function () {
        // Validate recipient email
        const recipientEmail =localStorage.getItem("email");
        const currentUserEmail = localStorage.getItem("email");
        const username = localStorage.getItem(currentUserEmail);
        
        

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
            totalAmount: paymentDetails.totalAmount,
            ticketSummary: `Total Tickets Booked: ${ticketCount}`,
        };

        try {
            // Send email using EmailJS
            const response = await emailjs.send("service_zf7m9se", "template_upb839h", emailData);
            console.log("Email sent successfully:", response);

            // Display success message
            alert("Payment Confirmed! Your ticket details have been sent to your email.");

            // Save ticket details to 'myTickets' in localStorage
            let myTickets = JSON.parse(localStorage.getItem("myTickets")) || [];
            myTickets.push({ eventDetails, ticketsCount: ticketCount });
            localStorage.setItem("myTickets", JSON.stringify(myTickets));

            // Clear payment details and navigate to home page
            localStorage.removeItem("paymentDetails");
            window.location.href = "../index.html";
        } catch (error) {
            console.error("Failed to send email:", error);
            alert("There was an issue sending your ticket details. Please try again later.");
        }
    });
});
