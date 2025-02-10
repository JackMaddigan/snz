// Get menu icon and nav links
const menuIcon = document.getElementById("menu-icon");
const nav = document.querySelector(".nav");

// Toggle the active class to show/hide the menu on mobile
menuIcon.addEventListener("click", () => {
  nav.classList.toggle("nav-active");
});
