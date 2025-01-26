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
let cat, ball;

// Load assets
const catImage = new Image();
catImage.src = 'cat.png'; // Ensure this path is correct

const ballImage = new Image();
ballImage.src = 'ball.png'; // Ensure this path is correct

// Background music
const music = new Howl({
  src: ['music.mp3'],
  loop: true,
  volume: 0.5
});
music.play();

// Generate a random level
function generateLevel() {
  // Clear existing bodies
  World.clear(world);

  // Add invisible walls to constrain objects to the screen
  const walls = [
    Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 10, { isStatic: true, render: { visible: false } }), // Top
    Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 10, { isStatic: true, render: { visible: false } }), // Bottom
    Bodies.rectangle(0, window.innerHeight / 2, 10, window.innerHeight, { isStatic: true, render: { visible: false } }), // Left
    Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 10, window.innerHeight, { isStatic: true, render: { visible: false } }) // Right
  ];
  World.add(world, walls);

  // Add cat
  cat = Bodies.circle(100, 100, 30, {
    render: {
      sprite: {
        texture: 'cat.png',
        xScale: 0.5,
        yScale: 0.5
      }
    },
    restitution: 0.8, // Bounciness
    friction: 0.1 // Slipperiness
  });
  World.add(world, cat);

  // Add ball
  ball = Bodies.circle(window.innerWidth - 100, window.innerHeight - 100, 20, {
    render: {
      sprite: {
        texture: 'ball.png',
        xScale: 0.5,
        yScale: 0.5
      }
    },
    isStatic: true // Ball doesn't move
  });
  World.add(world, ball);

  // Add random obstacles (walls, sand traps, portals, etc.)
  // Example: Add a sand trap
  const sandTrap = Bodies.rectangle(window.innerWidth / 2, window.innerHeight / 2, 200, 20, {
    isStatic: true,
    render: {
      fillStyle: '#f4d03f',
      opacity: 0.8
    }
  });
  World.add(world, sandTrap);
}

// Initialize game
generateLevel();

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
    isDragging = true;
  });

  mouseConstraint.mouse.element.addEventListener('mouseup', () => {
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
const savedGame = JSON.parse(localStorage.getItem('catPhysicsGame'));
if (savedGame) {
  level = savedGame.level;
  score = savedGame.score;
  document.getElementById('level').textContent = level;
  document.getElementById('score').textContent = score;
}

console.log('Game initialized!');
