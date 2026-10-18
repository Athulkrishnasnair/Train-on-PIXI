import { Graphics } from 'pixi.js';

export function addMountains(app) {
    
    // Create two mountains and offset one of them
    const group1 = createMountainGroup(app);
    const group2 = createMountainGroup(app);

    group2.x = app.screen.width;
    app.stage.addChild(group1, group2)

    //  Animate
    app.ticker.add((time) => {
    const dx = time.deltaTime * 50;

    group1.x -= dx;
    group2.x -= dx;

    if (group1.x <= app.screen.width) {
        group1.x += app.screen.width * 2;
    }

    if (group2.x <= -app.screen.width) {
        group2.x += app.screen.width * 2
    }
});

}

function createMountainGroup(app) {
    
    // Mountain properties
    const graphics = new Graphics();

    const width = app.screen.width / 2;
    const startY = app.screen.height;
    const startXLeft = 0;
    const startXMiddle = Number(app.screen.width) / 4;
    const startXRight = app.screen.width / 2;
    const heightLeft = app.screen.height / 2;
    const heightMiddle = (app.screen.height * 4) / 5;
    const heightRight = (app.screen.height * 2) / 3;
    const colorLeft = 0xc1c0c2;
    const colorMiddle = 0x7e818f;
    const colorRight = 0x8c919f;

    // Draw middle Mountain
    graphics.moveTo(startXMiddle, startY)
    .bezierCurveTo(
        startXMiddle + width / 2,
        startY - heightMiddle,
        startXMiddle + width / 2,
        startY - heightMiddle,
        startXMiddle + width,
        startY
    )
    .fill({
        color: colorMiddle,
    })

    // Draw left Mountain
    .moveTo(startXLeft, startY) 
    .bezierCurveTo(
        startXLeft + width / 2,
        startY - heightLeft,
        startXLeft + width / 2,
        startY - heightLeft,
        startXLeft + width,
        startY
    )
    .fill({
        color: colorLeft,
    })

    // Draw right Mountain
    .moveTo(startXRight, startY)
    .bezierCurveTo(
        startXRight + width / 2,
        startY - heightRight,
        startXRight + width / 2,
        startY - heightRight,
        startXRight + width,
        startY
    )
    .fill({
        color: colorRight,
    })

    // Return graphics obj
    return graphics;

}



