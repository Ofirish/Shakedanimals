const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint } = Matter;

// Create an engine
const engine = Engine.create();
const { world } = engine;

// Adjust gravity to make the ball bounce longer
engine.world.gravity.y = 0.5; // Reduce gravity for longer bounces

// Create a renderer
const board = document.getElementById('board');
const render = Render.create({
  element: board,
  engine: engine,
  options: {
    width: 500,
    height: 500,
    wireframes: false, // Set to false to enable colors
    background: '#ffffff',
  },
});

// Add a circle with higher restitution and lower friction
const circle = Bodies.circle(250, 250, 25, {
  density: 0.04,
  frictionAir: 0.05, // Lower air resistance for slower deceleration
  restitution: 0.95, // Higher bounciness
  render: {
    fillStyle: '#3498db', // Circle color
  },
});

// Add walls (static bodies)
const walls = [
  Bodies.rectangle(250, 0, 500, 10, { isStatic: true }), // Top wall
  Bodies.rectangle(250, 500, 500, 10, { isStatic: true }), // Bottom wall
  Bodies.rectangle(0, 250, 10, 500, { isStatic: true }), // Left wall
  Bodies.rectangle(500, 250, 10, 500, { isStatic: true }), // Right wall
];

// Add mouse control
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2, // Controls how "stiff" the drag feels
    render: {
      visible: false, // Hide the constraint line
    },
  },
});

// Add a custom event to constrain the circle within the board
Matter.Events.on(mouseConstraint, 'mousemove', () => {
  const { x, y } = circle.position;
  const radius = circle.circleRadius;

  // Constrain the circle within the board boundaries
  if (x - radius < 0) circle.position.x = radius;
  if (x + radius > 500) circle.position.x = 500 - radius;
  if (y - radius < 0) circle.position.y = radius;
  if (y + radius > 500) circle.position.y = 500 - radius;
});

// Add everything to the world
World.add(world, [circle, ...walls, mouseConstraint]);

// Run the engine and renderer
Engine.run(engine);
Render.run(render);