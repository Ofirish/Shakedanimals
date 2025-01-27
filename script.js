const circle = document.getElementById('circle');
const board = document.getElementById('board');

// Variables to track dragging state
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

// Velocity for the ball
let velocityX = 0;
let velocityY = 0;

// Animation loop
function updatePosition() {
  if (!isDragging) {
    // Update the circle's position based on velocity
    const boardRect = board.getBoundingClientRect();
    const rect = circle.getBoundingClientRect();

    let newX = rect.left + velocityX - boardRect.left;
    let newY = rect.top + velocityY - boardRect.top;

    // Bounce off the walls
    if (newX <= 0 || newX >= boardRect.width - circle.offsetWidth) {
      velocityX *= -1; // Reverse X direction
      newX = Math.max(0, Math.min(newX, boardRect.width - circle.offsetWidth));
    }
    if (newY <= 0 || newY >= boardRect.height - circle.offsetHeight) {
      velocityY *= -1; // Reverse Y direction
      newY = Math.max(0, Math.min(newY, boardRect.height - circle.offsetHeight));
    }

    // Update the circle's position
    circle.style.left = `${newX}px`;
    circle.style.top = `${newY}px`;
  }

  // Keep updating the position
  requestAnimationFrame(updatePosition);
}

// Start the animation loop
updatePosition();

// Mouse down: Start dragging
circle.addEventListener('mousedown', (e) => {
  isDragging = true;
  circle.style.cursor = 'grabbing';

  // Stop the velocity when dragging starts
  velocityX = 0;
  velocityY = 0;

  // Calculate the offset between the mouse position and the circle's position
  const rect = circle.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
});

// Mouse move: Drag the circle
document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  // Calculate the new position
  const boardRect = board.getBoundingClientRect();
  let newX = e.clientX - boardRect.left - offsetX;
  let newY = e.clientY - boardRect.top - offsetY;

  // Constrain the circle within the board
  newX = Math.max(0, Math.min(newX, boardRect.width - circle.offsetWidth));
  newY = Math.max(0, Math.min(newY, boardRect.height - circle.offsetHeight));

  // Update the circle's position
  circle.style.left = `${newX}px`;
  circle.style.top = `${newY}px`;
});

// Mouse up: Stop dragging and set velocity
document.addEventListener('mouseup', (e) => {
  if (!isDragging) return;

  isDragging = false;
  circle.style.cursor = 'grab';

  // Calculate velocity based on the release movement
  const rect = circle.getBoundingClientRect();
  const boardRect = board.getBoundingClientRect();

  // Release velocity based on cursor's movement
  velocityX = (e.movementX || 0) * 0.5; // Scale down movement for smoother motion
  velocityY = (e.movementY || 0) * 0.5;
});
