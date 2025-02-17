const galleryInner = document.querySelector(".gallery-inner");
const leftButton = document.querySelector(".gallery-btn.left");
const rightButton = document.querySelector(".gallery-btn.right");
let currentIndex = 0;

// Get all images in the gallery
const images = document.querySelectorAll(".gallery-inner img");
const totalImages = images.length;
let timeout; // Store the timeout reference

// Function to update the gallery position
function updateGallery() {
  const offset = -currentIndex * 100; // Move left or right based on the current index
  galleryInner.style.transform = `translateX(${offset}%)`;

  restartCarousel(); // Restart the timer after every manual or automatic update
}

// Left arrow click handler
leftButton.addEventListener("click", () => {
  currentIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
  updateGallery();
});

// Right arrow click handler
rightButton.addEventListener("click", () => {
  currentIndex = currentIndex === totalImages - 1 ? 0 : currentIndex + 1;
  updateGallery();
});

// Function to start automatic slideshow
function runCarousel() {
  currentIndex = (currentIndex + 1) % totalImages; // Loop back to the first image
  updateGallery();
}

// Function to restart the carousel timer
function restartCarousel() {
  clearTimeout(timeout); // Clear the previous timeout
  timeout = setTimeout(runCarousel, 4000); // Restart the timeout
}

// Start the automatic carousel
timeout = setTimeout(runCarousel, 4000);
