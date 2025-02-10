const galleryInner = document.querySelector(".gallery-inner");
const leftButton = document.querySelector(".gallery-btn.left");
const rightButton = document.querySelector(".gallery-btn.right");
let currentIndex = 0;

// Get all images in the gallery
const images = document.querySelectorAll(".gallery-inner img");
const totalImages = images.length;

// Function to update the gallery position
function updateGallery() {
  const offset = -currentIndex * 100; // Move left or right based on the current index
  galleryInner.style.transform = `translateX(${offset}%)`;
}

// Left arrow click handler
leftButton.addEventListener("click", () => {
  currentIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1; // Loop to last image
  updateGallery();
});

// Right arrow click handler
rightButton.addEventListener("click", () => {
  currentIndex = currentIndex === totalImages - 1 ? 0 : currentIndex + 1; // Loop to first image
  updateGallery();
});
