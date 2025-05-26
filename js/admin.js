document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("concertForm");
    const deleteConcertBtn = document.getElementById("deleteConcertBtn");
    const statusMessage = document.getElementById("statusMessage");
  
    // Add Concert
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const ticketprice = {};
      const vip = document.getElementById("vipPrice").value;
      const general = document.getElementById("generalPrice").value;
      const basic = document.getElementById("basicPrice").value;
  
      if (vip) ticketprice.vip = parseInt(vip);
      if (general) ticketprice.general = parseInt(general);
      if (basic) ticketprice.basic = parseInt(basic);
  
      const concertData = {
        artist: document.getElementById("artist").value,
        venue: document.getElementById("venue").value,
        city: document.getElementById("city").value,
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
        genre: document.getElementById("genre").value,
        imageUrl: document.getElementById("image").value,
        ticketprice: ticketprice,
      };
  
      const concertId = document.getElementById("concertId").value;
  
      try {
        if (concertId) {
          // Update existing concert
          const response = await fetch(`http://localhost:8080/api/concerts/${concertId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(concertData),
          });
  
          if (!response.ok) {
            throw new Error("Failed to update concert");
          }
  
          statusMessage.textContent = "Concert updated successfully!";
        } else {
          // Add new concert
          const response = await fetch("http://localhost:8080/api/concerts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(concertData),
          });
  
          if (!response.ok) {
            throw new Error("Failed to add concert");
          }
  
          statusMessage.textContent = "Concert added successfully!";
        }
  
        form.reset();
        document.getElementById("concertId").value = "";
      } catch (error) {
        statusMessage.textContent = `Error: ${error.message}`;
        console.error("Error:", error);
      }
    });
  
    //Delete Concert
    deleteConcertBtn.addEventListener("click", async () => {
      const concertIdToDelete = document.getElementById("concertIdToDelete").value;
  
      if (!concertIdToDelete) {
        statusMessage.textContent = "Please enter a concert ID to delete.";
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:8080/api/concerts/${concertIdToDelete}`, {
          method: "DELETE",
        });
  
        if (!response.ok) {
          throw new Error("Failed to delete concert");
        }
  
        statusMessage.textContent = "Concert deleted successfully!";
        document.getElementById("concertIdToDelete").value = ""; 
      } catch (error) {
        statusMessage.textContent = `Error: ${error.message}`;
        console.error("Error:", error);
      }
    });
  });
  