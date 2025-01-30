const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint } = Matter;

// Create an engine
const engine = Engine.create();
const { world } = engine;

// Adjust gravity to make the ball bounce longer
engine.world.gravity.y = 0.5;

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
let circle = Bodies.circle(250, 250, 25, {
  density: 0.04,
  frictionAir: 0.05, // Lower air resistance for slower deceleration
  restitution: 0.95, // Higher bounciness
  render: {
    fillStyle: '#3498db', // Default circle color
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

// Add a custom event to constrain the avatars within the board
Matter.Events.on(engine, 'beforeUpdate', () => {
  const { x, y } = circle.position;
  const radius = circle.circleRadius || 25; // Default radius for non-circle shapes

  // Constrain the ball within the board boundaries
  const boardRect = document.getElementById('board').getBoundingClientRect();
  if (x - radius < 0) circle.position.x = radius;
  if (x + radius > boardRect.width) circle.position.x = boardRect.width - radius;
  if (y - radius < 0) circle.position.y = radius;
  if (y + radius > boardRect.height) circle.position.y = boardRect.height - radius;
});

// Add everything to the world
World.add(world, [circle, ...walls, mouseConstraint]);

// Run the engine and renderer
Matter.Runner.run(engine); // Use Matter.Runner.run instead of Engine.run
Render.run(render);

// Avatar click functionality
const avatars = document.querySelectorAll('.avatar');
avatars.forEach(avatar => {
  avatar.addEventListener('click', () => {
    const shape = avatar.getAttribute('data-shape');

    // Remove the current circle from the world
    World.remove(world, circle);

    // Create a new body based on the clicked avatar
    let newBody;
    switch (shape) {
      case 'circle':
        newBody = Bodies.circle(circle.position.x, circle.position.y, 25, {
          density: 0.04,
          frictionAir: 0.05,
          restitution: 0.95,
          render: {
            fillStyle: '#3498db', // Blue color for the circle
          },
        });
        break;
      case 'rectangle':
        newBody = Bodies.rectangle(circle.position.x, circle.position.y, 50, 50, {
          density: 0.04,
          frictionAir: 0.05,
          restitution: 0.95,
          render: {
            fillStyle: '#3498db',
          },
        });
        break;
      case 'triangle':
        newBody = Bodies.polygon(circle.position.x, circle.position.y, 3, 30, {
          density: 0.04,
          frictionAir: 0.05,
          restitution: 0.95,
          render: {
            fillStyle: '#e74c3c',
          },
        });
        break;
      case 'cat':
        newBody = Bodies.circle(circle.position.x, circle.position.y, 25, {
          density: 0.04,
          frictionAir: 0.05,
          restitution: 0.95,
          render: {
            fillStyle: '#ffffff',
            sprite: {
              texture: 'https://github.com/Ofirish/Shakedanimals/blob/main/images/cat.PNG?raw=true',
              xScale: 1,
              yScale: 1,
            },
          },
        });
        break;
      case 'dog':
        newBody = Bodies.circle(circle.position.x, circle.position.y, 25, {
          density: 0.04,
          frictionAir: 0.05,
          restitution: 0.95,
          render: {
            fillStyle: '#ffffff',
            sprite: {
              texture: 'https://github.com/Ofirish/Shakedanimals/blob/main/images/dog.PNG?raw=true',
              xScale: 1,
              yScale: 1,
            },
          },
        });
        break;
    }

    // Add the new body to the world and update the circle reference
    World.add(world, newBody);
    circle = newBody;
  });
});

// Add touch support for avatars
avatars.forEach(avatar => {
  avatar.addEventListener('touchstart', (event) => {
    event.preventDefault();
    const shape = avatar.getAttribute('data-shape');

    // Remove the current circle from the world
    World.remove(world, circle);

    // Create a new body based on the clicked avatar
    let newBody;
    switch (shape) {
      case 'circle':
        newBody = Bodies.circle(circle.position.x, circle.position.y, 25, {
          density: 0.04,
          frictionAir: 0.05,
          restitution: 0.95,
          render: {
            fillStyle: '#3498db', // Blue color for the circle
          },
        });
        break;
      case 'rectangle':
        newBody = Bodies.rectangle(circle.position.x, circle.position.y, 50, 50, {
          density: 0.04,
          frictionAir: 0.05,
          restitution: 0.95,
          render: {
            fillStyle: '#3498db',
          },
        });
        break;
      case 'triangle':
        newBody = Bodies.polygon(circle.position.x, circle.position.y, 3, 30, {
          density: 0.04,
          frictionAir: 0.05,
          restitution: 0.95,
          render: {
            fillStyle: '#e74c3c',
          },
        });
        break;
      case 'cat':
        newBody = Bodies.circle(circle.position.x, circle.position.y, 25, {
          density: 0.04,
          frictionAir: 0.05,
          restitution: 0.95,
          render: {
            fillStyle: '#ffffff',
            sprite: {
              texture: 'https://github.com/Ofirish/Shakedanimals/blob/main/images/cat.PNG?raw=true',
              xScale: 1,
              yScale: 1,
            },
          },
        });
        break;
      case 'dog':
        newBody = Bodies.circle(circle.position.x, circle.position.y, 25, {
          density: 0.04,
          frictionAir: 0.05,
          restitution: 0.95,
          render: {
            fillStyle: '#ffffff',
            sprite: {
              texture: 'https://github.com/Ofirish/Shakedanimals/blob/main/images/dog.PNG?raw=true',
              xScale: 1,
              yScale: 1,
            },
          },
        });
        break;
    }

    // Add the new body to the world and update the circle reference
    World.add(world, newBody);
    circle = newBody;
  });
});

// Background Thumbnails Functionality
const thumbnails = document.querySelectorAll('.thumbnail');
const body = document.body;

thumbnails.forEach(thumbnail => {
  thumbnail.addEventListener('click', () => {
    const bgUrl = thumbnail.getAttribute('data-bg');
    body.style.backgroundImage = `url(${bgUrl})`;
    body.style.backgroundSize = 'cover';
    body.style.backgroundPosition = 'center';
  });
});

// Add touch support for background thumbnails
thumbnails.forEach(thumbnail => {
  thumbnail.addEventListener('touchstart', (event) => {
    event.preventDefault();
    const bgUrl = thumbnail.getAttribute('data-bg');
    body.style.backgroundImage = `url(${bgUrl})`;
    body.style.backgroundSize = 'cover';
    body.style.backgroundPosition = 'center';
  });
});

// Automatically change background every 10 seconds
let currentBgIndex = 0;
const bgUrls = [
  'https://github.com/Ofirish/Shakedanimals/blob/main/images/ssfbnw.jpg?raw=true',
  'https://github.com/Ofirish/Shakedanimals/blob/main/images/ssfblue.jpg?raw=true',
  'https://github.com/Ofirish/Shakedanimals/blob/main/images/ssfhand.jpg?raw=true',
  'https://github.com/Ofirish/Shakedanimals/blob/main/images/ssfcoloring.jpg?raw=true',
];

setInterval(() => {
  currentBgIndex = (currentBgIndex + 1) % bgUrls.length;
  body.style.backgroundImage = `url(${bgUrls[currentBgIndex]})`;
}, 10000);

// Refresh button functionality
const refreshButton = document.getElementById('refresh-button');
refreshButton.addEventListener('click', () => {
  location.reload();
});