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
    wireframes: true, // Enable this temporarily for debugging
    background: 'transparent',
  },
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Game variables
let cat, ball;

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
  generateLevel();
});

function generateLevel() {
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
  cat = Bodies.circle(100, 100, 30, { // Increased radius for testing
    render: {
      sprite: {
        texture: catImage.src,
        xScale: 0.3,
        yScale: 0.3,
      },
    },
    isStatic: false,
    density: 0.001,
  });
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
      render: { visible: false },
    },
  });
  World.add(world, mouseConstraint);

  // Debug mouse events
  render.canvas.addEventListener('mousedown', (e) => {
    console.log('Canvas clicked at:', e.clientX, e.clientY);
  });

  Events.on(mouseConstraint, 'startdrag', (event) => {
    console.log('Start dragging:', event.body);
  });

  Events.on(mouseConstraint, 'mousemove', (event) => {
    const mousePos = event.mouse.position;
    const isMouseOverCat = Matter.Bounds.contains(cat.bounds, mousePos);
    console.log('Mouse over cat:', isMouseOverCat);
  });
} else {
  console.error('Render or canvas not initialized!');
}

// Handle window resizing
window.addEventListener('resize', () => {
  render.canvas.width = window.innerWidth;
  render.canvas.height = window.innerHeight;
  generateLevel();
});
