import { Graphics } from "pixi.js";

// Builds a row of trees and scrolls them to make the train feel like it moves.
export function addTrees(app) {
  const treeWidth = 200;
  // Place the tree bottoms just above the snow bank.
  const y = app.screen.height - 20;
  const spacing = 15;
  const count = Math.ceil(app.screen.width / (treeWidth + spacing)) + 1;
  const trees = [];

  for (let i = 0; i < count; i++) {
    // Vary tree height so the row looks less repetitive.
    const treeHeight = 250 + Math.random() * 110;
    const tree = createTree(treeWidth, treeHeight);

    // x/y are the tree's position; its local drawing is centered horizontally.
    tree.x = i * (treeWidth + spacing);
    tree.y = y;
    app.stage.addChild(tree);
    trees.push(tree);
  }

  app.ticker.add((time) => {
    const dx = time.deltaTime * 8;

    trees.forEach((tree) => {
      tree.x -= dx;

      // Recycle trees after their center has moved off-screen.
      if (tree.x <= -(treeWidth / 2 + spacing)) {
        tree.x += count * (treeWidth + spacing) + spacing * 3;
      }
    });
  });
}

// Draws a tree around its origin so setting tree.y can place its bottom neatly.
function createTree(width, height) {
  const trunkWidth = 30;
  const trunkHeight = height / 4;
  const trunkColor = 0x563929;
  const graphics = new Graphics();

  // The trunk is centered on x = 0 and extends upward from the tree origin.
  graphics
    .rect(-trunkWidth / 2, -trunkHeight, trunkWidth, trunkHeight)
    .fill({ color: trunkColor });

  const crownHeight = height - trunkHeight;
  const crownLevel = 4;
  const crownLevelHeight = crownHeight / crownLevel;
  const crownWidthIncrement = width / crownLevel;
  const crownColor = 0x264d3d;

  // Each triangular layer becomes narrower as it rises toward the treetop.
  for (let i = 0; i < crownLevel; i++) {
    const y = -trunkHeight - crownLevelHeight * i;
    const levelWidth = width - crownWidthIncrement * i;
    // Lower layers overlap the triangle above so no gaps show between them.
    const overlap = i < crownLevel - 1 ? crownLevelHeight / 2 : 0;

    // moveTo()/lineTo() describe the triangle; fill() closes and colors it.
    graphics
      .moveTo(-levelWidth / 2, y)
      .lineTo(0, y - crownLevelHeight - overlap)
      .lineTo(levelWidth / 2, y)
      .fill({ color: crownColor });
  }

  return graphics;
}