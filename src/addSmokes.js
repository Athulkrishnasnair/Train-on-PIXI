import { Graphics } from "pixi.js";

// Creates several smoke puffs and repeatedly moves them away from the engine.
export function addSmokes(app, train) {
    // Each group is one puff made from several overlapping circles.
    const groupCount = 5;
    const particleCount = 7;
    const group = [];
    // These values place smoke behind and above the train's local origin.
    const baseX = train.x + 170;
    const baseY = train.y - 120;

    for (let i = 0; i < groupCount; i++) {
        // One Graphics object holds all the circles that make up one puff.
        const smokeGroup = new Graphics();

        for (let particleIndex = 0; particleIndex < particleCount; particleIndex++) {
            // Vary each circle's radius and position so puffs look irregular.
            const radius = 20 + Math.random() * 20;
            const x = (Math.random() * 2 - 1) * 40;
            const y = (Math.random() * 2 - 1) * 40;
            smokeGroup.circle(x, y, radius);
        }

        // fill() colors every circle in this Graphics object. The fill alpha
        // makes the circles translucent so overlapping smoke looks softer.
        smokeGroup.fill({
            color: 0xc9c9c9,
            alpha: 0.5,
        });

        // x and y position the puff; tick stores its progress through a cycle.
        smokeGroup.x = baseX;
        smokeGroup.y = baseY;
        smokeGroup.tick = i * (1 / groupCount);

        app.stage.addChild(smokeGroup);
        group.push(smokeGroup);
    }

    // Pixi calls this once per frame. Each puff advances at a slightly
    // different starting point so smoke appears to rise continuously.
    app.ticker.add((time) => {
        const dt = time.deltaTime * 0.01;

        group.forEach((smokeGroup) => {
            // % 1 wraps progress back into the 0..1 range for another puff cycle.
            smokeGroup.tick = (smokeGroup.tick + dt) % 1;

            // As progress grows, the puff drifts left and upward.
            smokeGroup.x = baseX - Math.pow(smokeGroup.tick, 2) * 400;
            smokeGroup.y = baseY - smokeGroup.tick * 200;

            // scale.set() shrinks the puff from full-size to zero; alpha fades
            // it from semi-transparent toward invisible (0).
            smokeGroup.scale.set(Math.pow(smokeGroup.tick, 0.75));
            smokeGroup.alpha = 1 - Math.pow(smokeGroup.tick, 0.5);
        });
    });
}