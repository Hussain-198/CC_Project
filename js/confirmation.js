document.addEventListener("DOMContentLoaded", function () {
    const paymentDetails = JSON.parse(localStorage.getItem("paymentDetails"));
    const eventDetails = JSON.parse(localStorage.getItem("selectedEvent"));
    const selectedCategory = paymentDetails?.selectedCategory || "Not Specified";

    if (!paymentDetails || !eventDetails) {
        console.error("No payment or event details found!");
        alert("Payment or event details are missing. Please try again.");
        window.location.href = "../index.html";
        return;
    }

<<<<<<< HEAD
=======
    // Event Details
>>>>>>> 9ff99cf81519c2633b11a8f72ae77a4aee39d3db
    document.getElementById("eventTitle").textContent = eventDetails.title;
    document.getElementById("eventDescription").textContent = eventDetails.description;
    const eventImage = document.getElementById("eventImage");
    eventImage.src = eventDetails.image;
    eventImage.style.display = "block";

<<<<<<< HEAD
    document.getElementById("totalAmount").textContent = `₹${paymentDetails.totalAmount}`;

=======
    // Payment Details
    document.getElementById("totalAmount").textContent = `₹${paymentDetails.totalAmount}`;

    // Ticket Details
>>>>>>> 9ff99cf81519c2633b11a8f72ae77a4aee39d3db
    const ticketSummaryContainer = document.getElementById("ticketDetails");
    const ticketCount = paymentDetails.ticketCount || 0;

    const ticketSummaryElement = document.createElement("div");
    ticketSummaryElement.className = "mb-3 p-3 border rounded";
    ticketSummaryElement.innerHTML = `
        <p><strong>Selected Category:</strong> ${selectedCategory}</p>
        <p><strong>Total Tickets Booked:</strong> ${ticketCount}</p>
    `;
    ticketSummaryContainer.appendChild(ticketSummaryElement);

    emailjs.init("jC3jnKx1SmF2JyDUc");

<<<<<<< HEAD
    // console.log(username);
    

=======

    const supabaseUrl = 'https://tucnfihoexxepyafqfsw.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1Y25maWhvZXh4ZXB5YWZxZnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzM3MTMsImV4cCI6MjA0ODgwOTcxM30.f1X1ss__ak0Gsp3yfd81WVoGd_T18efO-VWwp4A5Zas';  // Replace with your Supabase URL;  // Replace with your Supabase API key
 
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Payment Button
>>>>>>> 9ff99cf81519c2633b11a8f72ae77a4aee39d3db
    document.getElementById("confirmPayment").addEventListener("click", async function () {
        const recipientEmail = localStorage.getItem("email");
        const username = localStorage.getItem("username") || "User";

        if (!recipientEmail) {
            alert("No email address found for the recipient.");
            return;
        }

<<<<<<< HEAD
=======
        // Email content
>>>>>>> 9ff99cf81519c2633b11a8f72ae77a4aee39d3db
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
<<<<<<< HEAD
            await emailjs.send("service_h0rp2df", "template_7qqhi6d", emailData);
            console.log("Email sent successfully");

            // Save the data to backend
            const ticketData = {
                userEmail: recipientEmail,
                username: username,
                eventTitle: eventDetails.title,
                eventDescription: eventDetails.description,
                eventDate: eventDetails.date || null,
                eventVenue: eventDetails.venue || null,
                selectedCategory: selectedCategory,
                totalAmount: paymentDetails.totalAmount,
                ticketCount: ticketCount
            };
=======
            // Sending mail using EmailJS
            const response = await emailjs.send("service_h0rp2df", "template_7qqhi6d", emailData);
            console.log("Email sent successfully:", response);

            // Save ticket details to Supabase
            const { data, error } = await supabase
                .from('tickets') // Table name
                .insert([
                    {
                        user_email: recipientEmail,
                        username: username,
                        event_title: eventDetails.title,
                        event_description: eventDetails.description,
                        event_date: eventDetails.date || null,
                        event_venue: eventDetails.venue || null,
                        selected_category: selectedCategory,
                        total_amount: paymentDetails.totalAmount,
                        ticket_count: ticketCount,
                    }
                ]);
>>>>>>> 9ff99cf81519c2633b11a8f72ae77a4aee39d3db

            const response = await fetch("http://localhost:8080/api/tickets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(ticketData)
            });

            if (!response.ok) {
                throw new Error("Failed to save ticket to backend");
            }

            console.log("Ticket saved to backend");

            // Saving in localStorage
            let myTickets = JSON.parse(localStorage.getItem("myTickets")) || [];
            myTickets.push({ eventDetails, ticketsCount: ticketCount, selectedCategory });
            localStorage.setItem("myTickets", JSON.stringify(myTickets));

            alert("Payment Confirmed! Your ticket details have been sent to your email.");
            localStorage.removeItem("paymentDetails");
            window.location.href = "../index.html";
        } catch (error) {
            console.error("Error processing ticket:", error);
            alert("There was an issue processing your payment. Please try again later.");
        }
    });
});
