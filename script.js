const circle = document.getElementById('circle');
const board = document.getElementById('board');

// Variables to track dragging state
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

// Mouse down: Start dragging
circle.addEventListener('mousedown', (e) => {
  isDragging = true;
  circle.style.cursor = 'grabbing';

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

// Mouse up: Stop dragging
document.addEventListener('mouseup', () => {
  isDragging = false;
  circle.style.cursor = 'grab';
});
