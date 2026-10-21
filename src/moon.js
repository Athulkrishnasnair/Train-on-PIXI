import { Graphics } from 'pixi.js';
import moonSvg from './assets/moon.svg?raw';

// Draw the supplied moon SVG and place it in the upper-right part of the sky.
export function addMoon(app) {
  // Graphics.svg() converts SVG markup into Pixi drawing geometry.
  const graphics = new Graphics().svg(moonSvg);

  // x and y move the moon from its local origin to its screen position.
  graphics.x = app.screen.width / 2 + 100;
  graphics.y = app.screen.height / 8;

  app.stage.addChild(graphics);
}
