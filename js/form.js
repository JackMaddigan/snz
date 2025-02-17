document
  .getElementById("contact-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Stop normal form submission

    let formData = new FormData(this);
    fetch(window.location.pathname, {
      method: "POST",
      body: formData,
    })
      .then(() => {
        this.style.display = "none"; // Hide the form
        document.getElementById("thank-you-message").style.display = "block"; // Show message
      })
      .catch((error) => console.error("Form submission error:", error));
  });
