import { Graphics } from 'pixi.js';

// Creates two repeating mountain groups and scrolls them from right to left.
export function addMountains(app) {
  const group1 = createMountainGroup(app);
  const group2 = createMountainGroup(app);

  // Start the second group one screen-width to the right of the first.
  group2.x = app.screen.width;
  app.stage.addChild(group1, group2);

  // Move both groups each frame, then wrap a group around after it leaves view.
  app.ticker.add((time) => {
    const dx = time.deltaTime * 1;

    group1.x -= dx;
    group2.x -= dx;

    if (group1.x <= -app.screen.width) {
        group1.x += app.screen.width * 2;
    }

    if (group2.x <= -app.screen.width) {
        group2.x += app.screen.width * 2;
    }
  });
}

// Draws a group containing three overlapping mountain peaks.
function createMountainGroup(app) {
  const graphics = new Graphics();

  // Each peak occupies half a screen width. The startY line is the bottom
  // edge of the canvas; subtracting a height moves a peak upward.
  const width = app.screen.width / 2;
  const startY = app.screen.height;
  const startXLeft = 0;
  const startXMiddle = app.screen.width / 4;
  const startXRight = app.screen.width / 2;
  const heightLeft = app.screen.height / 2;
  const heightMiddle = (app.screen.height * 4) / 5;
  const heightRight = (app.screen.height * 2) / 3;
  const colorLeft = 0xc1c0c2;
  const colorMiddle = 0x7e818f;
  const colorRight = 0x8c919f;

  // moveTo() starts a new path. bezierCurveTo() bends the mountain sides
  // smoothly; fill() closes and colors that path.
  graphics
    .moveTo(startXMiddle, startY)
    .bezierCurveTo(
        startXMiddle + width / 2,
        startY - heightMiddle,
        startXMiddle + width / 2,
        startY - heightMiddle,
        startXMiddle + width,
        startY
    )
    .fill({ color: colorMiddle })

    .moveTo(startXLeft, startY)
    .bezierCurveTo(
        startXLeft + width / 2,
        startY - heightLeft,
        startXLeft + width / 2,
        startY - heightLeft,
        startXLeft + width,
        startY
    )
    .fill({ color: colorLeft })

    .moveTo(startXRight, startY)
    .bezierCurveTo(
        startXRight + width / 2,
        startY - heightRight,
        startXRight + width / 2,
        startY - heightRight,
        startXRight + width,
        startY
    )
    .fill({ color: colorRight });

  return graphics;
}
