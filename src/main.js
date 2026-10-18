import { Application } from 'pixi.js';
import { addStars } from './stars.js';
import { addMoon } from './moon.js';
import { addMountains } from './mountains.js';
import { addTrees } from './trees.js';
import { addGround } from './ground.js';

const app = new Application();

// Asynchrous IIFE
(async () => {
  // Init app
  await app.init({
    background: '#021f4b',
    resizeTo: window,
  });

  // Append
  document.body.appendChild(app.canvas);

  // Call stars function
  addStars(app);

  // Call moon function
  addMoon(app);

  // Add Mountains
  addMountains(app);

  // Add trees
  addTrees(app);

  // Add Ground
  addGround(app);
})()

