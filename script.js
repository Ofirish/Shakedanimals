const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint } = Matter;

// Create an engine
const engine = Engine.create();
const { world } = engine;

// Create a renderer
const board = document.getElementById('board');
const render = Render.create({
  element: board,
  engine: engine,
  options: {
    width: 500,
    height: 500,
    wireframes: false,
    background: '#ffffff',
  },
});

// Add a circle
const circle = Bodies.circle(250, 250, 25, {
  density: 0.04,
  frictionAir: 0.1,
  restitution: 0.9,
  render: {
    fillStyle: '#3498db',
  },
});

// Add walls
const walls = [
  Bodies.rectangle(250, 0, 500, 10, { isStatic: true }), // Top
  Bodies.rectangle(250, 500, 500, 10, { isStatic: true }), // Bottom
  Bodies.rectangle(0, 250, 10, 500, { isStatic: true }), // Left
  Bodies.rectangle(500, 250, 10, 500, { isStatic: true }), // Right
];

// Add mouse control
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

// Add everything to the world
World.add(world, [circle, ...walls, mouseConstraint]);

// Run the engine and renderer
Engine.run(engine);
Render.run(render);