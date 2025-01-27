// Initialize Matter.js
const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint, Events } = Matter;

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
    background: 'transparent',
  },
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Game variables
let cat, ball; // Declare globally

// Load assets
const catImage = new Image();
catImage.src = 'https://raw.githubusercontent.com/Ofirish/Shakedanimals/refs/heads/main/Cat.png';

const ballImage = new Image();
ballImage.src = 'https://raw.githubusercontent.com/Ofirish/Shakedanimals/refs/heads/main/Ball.png';

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
  }),
]).then(() => {
  // Images are loaded, now generate the level
  generateLevel();
});

function generateLevel() {
  // Clear existing bodies
  World.clear(world);

  // Add walls
  const walls = [
    Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 10, { isStatic: true }),
    Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 10, { isStatic: true }),
    Bodies.rectangle(0, window.innerHeight / 2, 10, window.innerHeight, { isStatic: true }),
    Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 10, window.innerHeight, { isStatic: true }),
  ];
  World.add(world, walls);

  // Add cat
  cat = Bodies.circle(100, 100, 20, { // Increased radius for better interaction
    render: {
      sprite: {
        texture: catImage.src,
        xScale: 0.2,
        yScale: 0.2,
      },
    },
    restitution: 0.8,
    friction: 0.1,
    isStatic: false,
    density: 0.001, // Add realistic density
  });

  // Set collision filter for mouse interaction
  cat.collisionFilter = {
    group: 1,
    category: 0x0001,
    mask: 0xFFFFFFFF,
  };

  World.add(world, cat);

  // Add ball
  ball = Bodies.circle(window.innerWidth - 100, window.innerHeight - 100, 10, {
    render: {
      sprite: {
        texture: ballImage.src,
        xScale: 0.1,
        yScale: 0.1,
      },
    },
    isStatic: false,
  });
  World.add(world, ball);
}

// Mouse control
if (render && render.canvas) {
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });
  World.add(world, mouseConstraint);

  // Debugging mouse events
  render.canvas.addEventListener('mousedown', (e) => {
    console.log('Canvas clicked at:', e.clientX, e.clientY);
  });

  Events.on(mouseConstraint, 'startdrag', (event) => {
    console.log('Start dragging:', event.body);
  });

  Events.on(mouseConstraint, 'enddrag', (event) => {
    console.log('End dragging:', event.body);
  });
} else {
  console.error('Render or canvas not initialized!');
}

// Check for win condition
Events.on(engine, 'collisionStart', (event) => {
  const pairs = event.pairs;
  for (let pair of pairs) {
    if (
      (pair.bodyA === cat && pair.bodyB === ball) ||
      (pair.bodyA === ball && pair.bodyB === cat)
    ) {
      alert('You won!');
      generateLevel();
    }
  }
});

// Handle window resizing
window.addEventListener('resize', () => {
  render.canvas.width = window.innerWidth;
  render.canvas.height = window.innerHeight;
  generateLevel();
});
