document
  .getElementById("contact-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    this.innerHTML = `<div class="content-row form-submitted"><h2 class="highlight-txt">Thank you for submitting your message! We will be in touch soon.</h2></div>`;
  });
