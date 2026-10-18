import { Graphics } from "pixi.js";

export function addTrees(app) {
    
    // Trees metadata
    const treeWidth = 200;
    const y = app.screen.height - 20;
    const spacing = 15;
    const count = app.screen.width / (treeWidth + spacing) + 1;
    const trees = [];

    // Spawn each trees
    for (let i = 0; i < count; i ++) {
        const treeHeight = 250 + Math.random() * 110;
        const tree = createTree(treeWidth, treeHeight);

        tree.x = i * (treeWidth + spacing);
        tree.y = y;

        app.stage.addChild(tree);
        trees.push(tree)
    }

    // Animate the trees
    app.ticker.add((time) => {
        const dx = time.deltaTime * 8;

        // Apply to each tree
        trees.forEach((tree) => {
            tree.x -= dx;

            if (tree.x <= -(treeWidth / 2 + spacing)) {
                tree.x += count * (treeWidth + spacing) + spacing * 3;
            }
        });
    });

}

function createTree(width, height) {

    // Tree properties
    const trunkWidth = 30;
    const trunkHeight = height / 4;
    const trunkColor = 0x563929;
    
    const graphics = new Graphics();
    
    graphics.rect(-trunkWidth / 2, -trunkHeight, trunkWidth, trunkHeight);
    graphics.fill({
        color: trunkColor
    });

    // Tree Crown
    const crownHeight = height - trunkHeight;
    const crownLevel = 4;
    const crownLevelHeight = crownHeight / crownLevel;
    const crownWidthIncrement = width / crownLevel;
    const crownColor = 0x264d3d;

    // A loop for each crowns (triangles)
    for (let i = 0; i < crownLevel; i++) {
        const y = -trunkHeight - crownLevelHeight * i;
        const levelWidth = width - crownWidthIncrement * i;
        const offset = i < crownLevel - 1 ? crownLevelHeight / 2 : 0;

        // Create object instances
        graphics.moveTo(-levelWidth / 2, y)
        .lineTo(0, y - crownLevelHeight - offset)
        .lineTo(levelWidth / 2, y)
        .fill({color: crownColor});
    }

    return graphics;
}