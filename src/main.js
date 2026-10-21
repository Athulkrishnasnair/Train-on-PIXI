import { Application, Container } from 'pixi.js';
import { addStars } from './stars.js';
import { addMoon } from './moon.js';
import { addMountains } from './mountains.js';
import { addTrees } from './trees.js';
import { addGround } from './ground.js';
import { addTrain } from './train.js';
import { addSmokes } from './addSmokes.js';

// Pixi's Application manages the canvas, rendering stage, screen size, and
// animation ticker used by the scene.
const app = new Application();

// Keep the locomotive and its smoke together so effects can follow the train.
const trainContainer = new Container();

// Application initialization is asynchronous, so wait until Pixi is ready
// before attaching its canvas or creating scene objects.
(async () => {
  await app.init({
    background: '#021f4b',
    // Match the Pixi canvas dimensions to the browser window.
    resizeTo: window,
  });

  // The canvas is Pixi's visible drawing surface.
  document.body.appendChild(app.canvas);

  // Add the background first, then scenery and ground, so later objects draw
  // in front of earlier ones.
  addStars(app);
  addMoon(app);
  addMountains(app);
  addTrees(app);
  addGround(app);

  // The train is added after the scenery so it appears in the foreground.
  addTrain(app, trainContainer);
  addSmokes(app, trainContainer);
})();
