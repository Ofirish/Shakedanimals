// Initialize Matter.js
const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint, Composite } = Matter;

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
        xScale: 0.5
