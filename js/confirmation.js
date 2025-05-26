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

    document.getElementById("eventTitle").textContent = eventDetails.title;
    document.getElementById("eventDescription").textContent = eventDetails.description;
    const eventImage = document.getElementById("eventImage");
    eventImage.src = eventDetails.image;
    eventImage.style.display = "block";

    document.getElementById("totalAmount").textContent = `₹${paymentDetails.totalAmount}`;

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

    // console.log(username);
    

    document.getElementById("confirmPayment").addEventListener("click", async function () {
        const recipientEmail = localStorage.getItem("email");
        const username = localStorage.getItem("username") || "User";

        if (!recipientEmail) {
            alert("No email address found for the recipient.");
            return;
        }

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
