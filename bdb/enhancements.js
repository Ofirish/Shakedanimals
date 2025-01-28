// enhancements.js

// Optimize Physics
engine.world.gravity.y = 0.3; // Reduce gravity for a floatier feel
circle.restitution = 0.98; // Increase bounciness
circle.frictionAir = 0.02; // Reduce air resistance for smoother movement

// Ball Trail Effect
const trail = [];
const trailLength = 10;

Matter.Events.on(engine, 'afterUpdate', () => {
  // Add the current ball position to the trail
  trail.push({ x: circle.position.x, y: circle.position.y });
  if (trail.length > trailLength) trail.shift(); // Keep the trail length fixed
});

Render.run(render, {
  controller: {
    afterRender: () => {
      const ctx = render.context;
      ctx.globalAlpha = 0.5; // Semi-transparent trail
      ctx.beginPath();
      trail.forEach((pos, i) => {
        const radius = circle.circleRadius * (i / trailLength); // Gradually reduce trail size
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      });
      ctx.strokeStyle = '#3498db'; // Trail color
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.globalAlpha = 1; // Reset transparency
    },
  },
});

// Squash and Stretch Effect on Collisions
Matter.Events.on(engine, 'collisionStart', (event) => {
    const pairs = event.pairs;
    pairs.forEach((pair) => {
      if (pair.bodyA === circle || pair.bodyB === circle) {
        // Apply subtle squash/stretch effect
        Matter.Body.scale(circle, 1.1, 0.9); // Less pronounced effect
        setTimeout(() => {
          Matter.Body.scale(circle, 1 / 1.1, 1 / 0.9); // Reset to original shape
        }, 100); // Duration of the effect
      }
    });
  });