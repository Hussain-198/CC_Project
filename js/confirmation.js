document.addEventListener("DOMContentLoaded", function () {
    const paymentDetails = JSON.parse(localStorage.getItem("paymentDetails"));
    const eventDetails = JSON.parse(localStorage.getItem("selectedEvent"));

    if (paymentDetails && eventDetails) {
        // Load Event Details
        document.getElementById("eventTitle").textContent = eventDetails.title;
        document.getElementById("eventDescription").textContent = eventDetails.description;
        const eventImage = document.getElementById("eventImage");
        eventImage.src = eventDetails.image;
        eventImage.style.display = "block";

        // Load Payment Summary
        document.getElementById("totalAmount").textContent = `₹${paymentDetails.totalAmount}`;

        // Load Ticket Details
        const ticketDetailsContainer = document.getElementById("ticketDetails");
        paymentDetails.tickets.forEach(ticket => {
            const ticketElement = document.createElement("div");
            ticketElement.className = "mb-3 p-3 border rounded";
            ticketElement.innerHTML = `
                <p><strong>Ticket #${ticket.ticketNo}</strong></p>
                <p>Name: ${ticket.firstName} ${ticket.lastName}</p>
                <p>Email: ${ticket.email}</p>
                <p>Phone: ${ticket.phone}</p>
            `;
            ticketDetailsContainer.appendChild(ticketElement);
        });
    } else {
        console.error("No payment or event details found!");
    }

    emailjs.init("6Kg5M-hZ9O2Sxbau7");

    // Confirm Payment Button
    document.getElementById("confirmPayment").addEventListener("click", async function () {
        const paymentDetails = JSON.parse(localStorage.getItem("paymentDetails"));
        const eventDetails = JSON.parse(localStorage.getItem("selectedEvent"));

        if (paymentDetails && eventDetails) {
            // Prepare the email content
            let ticketDetailsContent = '';
            paymentDetails.tickets.forEach(ticket => {
                ticketDetailsContent += `
                    <p><strong>Ticket #${ticket.ticketNo}</strong></p>
                    <p>Name: ${ticket.firstName} ${ticket.lastName}</p>
                    <p>Email: ${ticket.email}</p>
                    <p>Phone: ${ticket.phone}</p>
                    <hr />
                `;
            });

            // Get the recipient email and name
            const recipientEmail = paymentDetails.tickets[0].email;
            const recipientName = `${paymentDetails.tickets[0].firstName} ${paymentDetails.tickets[0].lastName}`;

            if (!recipientEmail) {
                alert("No email address found for the recipient.");
                return;
            }

            // Prepare email data
            const emailData = {
                to_email: recipientEmail,
                to_name: recipientName,
                eventTitle: eventDetails.title,
                eventDescription: eventDetails.description,
                eventDate: eventDetails.date || "TBD",
                eventVenue: eventDetails.venue || "TBD",
                totalAmount: paymentDetails.totalAmount,
                ticketDetails: ticketDetailsContent
            };

            try {
                // Send email using EmailJS
                const response = await emailjs.send('service_zf7m9se', 'template_upb839h', emailData);
                console.log('Email sent successfully:', response);
                alert("Payment Confirmed! Your ticket details have been sent to your email.");

                // Save ticket details to 'myTickets' in localStorage for My Tickets page
                let myTickets = JSON.parse(localStorage.getItem("myTickets")) || [];
                myTickets.push({ eventDetails, tickets: paymentDetails.tickets });
                localStorage.setItem("myTickets", JSON.stringify(myTickets));

                // Clear the payment details from localStorage and navigate to the home page
                localStorage.removeItem("paymentDetails");
                window.location.href = "../index.html";
            } catch (error) {
                console.error('Failed to send email:', error);
                alert("There was an issue sending your ticket details. Please try again.");
            }
        } else {
            alert("No payment or event details found!");
        }
    });
});
