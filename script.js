// Initialize Matter.js
const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint } = Matter;

// Create engine and renderer
const engine = Engine.create();
engine.world.gravity.y = 0; // Disable gravity for top-down view
const { world } = engine;

const render = Render.create({
  element: document.getElementById('game'),
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    background: 'transparent'
  }
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Game variables
let moves = 0;
let level = 1;
let score = 0;
let cat, ball; // Declare globally

// Load assets
const catImage = new Image();
catImage.src = 'https://raw.githubusercontent.com/Ofirish/Shakedanimals/refs/heads/main/Cat.png';

const ballImage = new Image();
ballImage.src = 'https://raw.githubusercontent.com/Ofirish/Shakedanimals/refs/heads/main/Ball.png'; // Update this path if needed

// Wait for images to load
Promise.all([
  new Promise((resolve) => {
    catImage.onload = resolve;
    catImage.onerror = () => {
      console.error('Failed to load cat image');
      resolve();
    };
  }),
  new Promise((resolve) => {
    ballImage.onload = resolve;
    ballImage.onerror = () => {
      console.error('Failed to load ball image');
      resolve();
    };
  })
]).then(() => {
  // Images are loaded, now generate the level
  generateLevel();
});

function generateLevel() {
  // Clear existing bodies
  World.clear(world);

  // Add walls
  const walls = [
    Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 10, { isStatic: true, render: { visible: false } }), // Top
    Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 10, { isStatic: true, render: { visible: false } }), // Bottom
    Bodies.rectangle(0, window.innerHeight / 2, 10, window.innerHeight, { isStatic: true, render: { visible: false } }), // Left
    Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 10, window.innerHeight, { isStatic: true, render: { visible: false } }) // Right
  ];
  World.add(world, walls);

  // Add cat (smaller size)
  cat = Bodies.circle(100, 100, 10, { // Radius reduced to 10
    render: {
      sprite: {
        texture: catImage.src,
        xScale: 0.2, // Smaller scaling
        yScale: 0.2  // Smaller scaling
      }
    },
    restitution: 0.8, // Bounciness
    friction: 0.1 // Slipperiness
  });
  World.add(world, cat);

  // Add ball (smaller size)
  ball = Bodies.circle(window.innerWidth - 100, window.innerHeight - 100, 5, { // Radius reduced to 5
    render: {
      sprite: {
        texture: ballImage.src,
        xScale: 0.1, // Smaller scaling
        yScale: 0.1  // Smaller scaling
      }
    },
    isStatic: false // Allow the ball to move
  });
  World.add(world, ball);

  // Add random obstacles (walls, sand traps, portals, etc.)
 const sandTrap = Bodies.rectangle(window.innerWidth / 2, window.innerHeight / 2, 100, 10, { // Smaller sand trap
  isStatic: true,
  render: {
    fillStyle: '#f4d03f',
    opacity: 0.8
  }
});
  World.add(world, sandTrap);
}

// Mouse control
if (render && render.canvas) {
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false
      }
    }
  });
  World.add(world, mouseConstraint);

  // Track moves
  let isDragging = false;
  mouseConstraint.mouse.element.addEventListener('mousedown', () => {
    console.log('Mouse down'); // Debugging
    isDragging = true;
  });

  mouseConstraint.mouse.element.addEventListener('mouseup', () => {
    console.log('Mouse up'); // Debugging
    if (isDragging) {
      moves++;
      document.getElementById('moves').textContent = moves;
      isDragging = false;
    }
  });
} else {
  console.error('Render or canvas not initialized!');
}

// Check for win condition
Matter.Events.on(engine, 'collisionStart', (event) => {
  const pairs = event.pairs;
  console.log('Collision detected:', pairs); // Debugging
  for (let pair of pairs) {
    if (pair.bodyA === cat && pair.bodyB === ball || pair.bodyA === ball && pair.bodyB === cat) {
      alert(`You won in ${moves} moves!`);
      score += 100 - moves; // Bonus for fewer moves
      document.getElementById('score').textContent = score;
      level++;
      document.getElementById('level').textContent = level;
      generateLevel();
      moves = 0;
      document.getElementById('moves').textContent = moves;
    }
  }
});

// Save game state to localStorage
window.addEventListener('beforeunload', () => {
  localStorage.setItem('catPhysicsGame', JSON.stringify({ level, score }));
});

// Load game state from localStorage
let savedGame;
try {
  savedGame = JSON.parse(localStorage.getItem('catPhysicsGame'));
} catch (e) {
  console.error('Failed to load saved game:', e);
}
if (savedGame) {
  level = savedGame.level;
  score = savedGame.score;
  document.getElementById('level').textContent = level;
  document.getElementById('score').textContent = score;
}

// Handle window resizing
window.addEventListener('resize', () => {
  render.canvas.width = window.innerWidth;
  render.canvas.height = window.innerHeight;
  generateLevel();
});

console.log('Game initialized!');
