import { Graphics } from 'pixi.js';

// Draws the snow bank, sleepers (the short cross-pieces), and rail.
export function addGround(app) {
  const width = app.screen.width;
  const groundHeight = 20;
  const groundY = app.screen.height;

  // Pixi coordinates start at the top-left, so this rectangle sits at the
  // bottom of the screen by subtracting its height from the screen height.
  const ground = new Graphics();
  ground
    .rect(0, groundY - groundHeight, width, groundHeight)
    .fill({ color: 0xdddddd });
  app.stage.addChild(ground);

  const trackHeight = 15;
  const plankWidth = 50;
  const plankHeight = trackHeight / 2;
  const plankGap = 20;
  // Make enough sleepers to cover the visible width, plus one to avoid a gap.
  const plankCount = Math.ceil(width / (plankWidth + plankGap)) + 1;
  const plankY = groundY - groundHeight;
  const planks = [];

  for (let i = 0; i < plankCount; i++) {
    const plank = new Graphics();
    plank
      .rect(0, plankY - plankHeight, plankWidth, plankHeight)
      .fill({ color: 0x241811 });

    // x is the object's horizontal position; place each sleeper one full
    // plank-plus-gap step after the previous one.
    plank.x = i * (plankWidth + plankGap);
    app.stage.addChild(plank);
    planks.push(plank);
  }

  // The ticker calls this once per rendered frame. deltaTime keeps motion
  // approximately consistent if the frame rate changes.
  app.ticker.add((time) => {
    const dx = time.deltaTime * 6;

    planks.forEach((plank) => {
      plank.x -= dx;

      // Once a sleeper has completely left the screen, move it to the end.
      // This reuses the same graphics instead of creating new objects.
      if (plank.x <= -(plankWidth + plankGap)) {
        plank.x += plankCount * (plankWidth + plankGap) + plankGap * 1.5;
      }
    });
  });

  const railHeight = trackHeight / 2;
  const railY = plankY - plankHeight;
  const rail = new Graphics();

  // The rail is drawn after the sleepers so it layers in front of them.
  rail
    .rect(0, railY - railHeight, width, railHeight)
    .fill({ color: 0x5c5c5c });
  app.stage.addChild(rail);
}