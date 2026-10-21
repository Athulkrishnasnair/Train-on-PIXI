import { Graphics } from 'pixi.js';

// Draws a small set of stars at repeatable positions with varied sizes/angles.
export function addStars(app) {
  const starCount = 20;
  const graphics = new Graphics();

  for (let i = 0; i < starCount; i++) {
    // Multiplying by different fractions and using % screen-size keeps each
    // coordinate inside the canvas while spreading stars across it.
    const x = (i * 0.786 * app.screen.width) % app.screen.width;
    const y = (i * 0.938 * app.screen.height) % app.screen.height;

    // Randomness gives each star a slightly different size and rotation.
    const radius = 2 + Math.random() * 3;
    const rotation = Math.random() * Math.PI * 2;

    // star(x, y, points, radius, innerRadius, rotation) draws a five-point star.
    graphics.star(x, y, 5, radius, 0, rotation);
    graphics.fill({ color: 0xffffff });
  }

  app.stage.addChild(graphics);
}