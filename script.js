// Initialize Matter.js
const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint } = Matter;

// Create engine and renderer
const engine = Engine.create();
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
catImage.src = 'cat.png';

const ballImage = new Image();
ballImage.src = 'ball.png';

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

  // Add walls
  const walls = [
    Bodies.rectangle(400, 0, 800, 50, { isStatic: true }), // Top
    Bodies.rectangle(400, 600, 800, 50, { isStatic: true }), // Bottom
    Bodies.rectangle(0, 300, 50, 600, { isStatic: true }), // Left
    Bodies.rectangle(800, 300, 50, 600, { isStatic: true }) // Right
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
    }
  });
  World.add(world, cat);

  // Add ball
  ball = Bodies.circle(700, 500, 20, {
    render: {
      sprite: {
        texture: 'ball.png',
        xScale: 0.5,
        yScale: 0.5
      }
    },
    isStatic: true
  });
  World.add(world, ball);

  // Add random obstacles (walls, sand traps, portals, etc.)
  // Example: Add a sand trap
  const sandTrap = Bodies.rectangle(400, 300, 200, 20, {
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
mouseConstraint.mouse.element.addEventListener('mousedown', () => {
  moves++;
  document.getElementById('moves').textContent = moves;
});

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
