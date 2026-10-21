import { Container, Graphics } from "pixi.js";

// The engine's large wheel defines the shared rail/contact height:
// its center is 5 px below the train origin and its radius is 55 px,
// so its bottom is at y = 5 + 55 = 60.
const BIG_WHEEL_RADIUS = 55;
const SMALL_WHEEL_RADIUS = 39;
const BIG_WHEEL_OFFSET_Y = 5;
const WHEEL_GROUND_Y = BIG_WHEEL_OFFSET_Y + BIG_WHEEL_RADIUS;

export function addTrain(app, container) {
  const head = createTrainHead(app);
  const carriage = createTrainCarriage(app);

  // Place the carriage to the left of the engine. Its measured width includes
  // the trim and wheels, so its right edge is aligned near the engine's origin.
  carriage.x = -carriage.width;
  container.addChild(head, carriage);
  app.stage.addChild(container);

  const scale = 0.75;
  container.scale.set(scale);

  // Center the engine (not the longer carriage) horizontally on the screen.
  container.x = app.screen.width / 2 - head.width / 2;

  // Pixi's y axis points down. This places the train's origin so the large
  // engine wheel's bottom (60 local px, scaled by 0.75) sits just above the
  // bottom edge of the screen, alongside the track.
  let elapsed = 0;
  const shakeDistance = 3;
  const baseY = app.screen.height - 35 - BIG_WHEEL_RADIUS * scale;
  const speed = 0.5;
  container.y = baseY;

  // A sine wave oscillates smoothly between -1 and 1. Multiplying
  // (sin(t) * 0.5 + 0.5) by shakeDistance instead maps it to 0..3 px.
  app.ticker.add((time) => {
    elapsed += time.deltaTime;
    const offset = (Math.sin(elapsed * 0.5 * speed) * 0.5 + 0.5) * shakeDistance;
    container.y = baseY + offset;
  });
}

function createTrainHead(app) {
  // Each train part is positioned relative to this local origin. Negative y
  // values place the body above the wheel/track baseline at y = 0.
  const container = new Container();

  // Front: the rounded nose is sized with a half-circle radius based on height.
  const frontHeight = 100;
  const frontWidth = 140;
  const frontRadius = frontHeight / 2;

  // Cabin dimensions and corner radius.
  const cabinHeight = 200;
  const cabinWidth = 150;
  const cabinRadius = 15;

  // Chimney dimensions. The top is wider than its base, so the difference is
  // split evenly on both sides: (top width - base width) / 2.
  const chimneyBaseWidth = 30;
  const chimneyTopWidth = 50;
  const chimneyHeight = 70;
  const chimneyDomeHeight = 25;
  const chimneyTopOffset = (chimneyTopWidth - chimneyBaseWidth) / 2;
  // Start at the nose's right side, backing off its rounded end and chimney base.
  const chimneyStartX = cabinWidth + frontWidth - frontRadius - chimneyBaseWidth;
  const chimneyStartY = -frontHeight;

  // The roof extends past each side of the cabin by half of roofExcess.
  const roofHeight = 25;
  const roofExcess = 20;

  // The door is 70% of the cabin dimensions and centered horizontally.
  const doorWidth = cabinWidth * 0.7;
  const doorHeight = cabinHeight * 0.7;
  const doorStartX = (cabinWidth - doorWidth) * 0.5;
  // Center the door vertically in the cabin, whose top is at -cabinHeight.
  const doorStartY = -(cabinHeight - doorHeight) * 0.5 - doorHeight;

  // The window is sized relative to the door and centered within it.
  const windowWidth = doorWidth * 0.8;
  const windowHeight = doorHeight * 0.4;
  const offset = (doorWidth - windowWidth) / 2;

  const graphics = new Graphics()
    // Draw the chimney
    .moveTo(chimneyStartX, chimneyStartY)
    .lineTo(chimneyStartX - chimneyTopOffset, chimneyStartY - chimneyHeight + chimneyDomeHeight)
    .quadraticCurveTo(
      chimneyStartX + chimneyBaseWidth / 2,
      chimneyStartY - chimneyHeight - chimneyDomeHeight,
      chimneyStartX + chimneyBaseWidth + chimneyTopOffset,
      chimneyStartY - chimneyHeight + chimneyDomeHeight,
    )
    .lineTo(chimneyStartX + chimneyBaseWidth, chimneyStartY)
    .fill({ color: 0x121212 })

    // Draw the head front
    .roundRect(
      cabinWidth - frontRadius - cabinRadius,
      -frontHeight,
      frontWidth + frontRadius + cabinRadius,
      frontHeight,
      frontRadius,
    )
    .fill({ color: 0x7f3333 })

    // Draw the cabin
    .roundRect(0, -cabinHeight, cabinWidth, cabinHeight, cabinRadius)
    .fill({ color: 0x725f19 })

    // Draw the roof
    .rect(-roofExcess / 2, cabinRadius - cabinHeight - roofHeight, cabinWidth + roofExcess, roofHeight)
    .fill({ color: 0x52431c })

    // Draw the door
    .roundRect(doorStartX, doorStartY, doorWidth, doorHeight, cabinRadius)
    .stroke({ color: 0x52431c, width: 3 })

    // Draw the window
    .roundRect(doorStartX + offset, doorStartY + offset, windowWidth, windowHeight, 10)
    .fill({ color: 0x848484 });

  // The large rear wheel and two smaller wheels share a common bottom height.
  const wheelGap = 15;

  const backWheel = createTrainWheel(BIG_WHEEL_RADIUS);
  const midWheel = createTrainWheel(SMALL_WHEEL_RADIUS);
  const frontWheel = createTrainWheel(SMALL_WHEEL_RADIUS);

  // The large wheel center is offset 5 px below the origin. The small-wheel
  // center is raised by the radius difference, keeping their bottoms aligned:
  // small center y = big center y + big radius - small radius = 5 + 55 - 39 = 21.
  backWheel.x = BIG_WHEEL_RADIUS;
  backWheel.y = BIG_WHEEL_OFFSET_Y;
  midWheel.x = backWheel.x + BIG_WHEEL_RADIUS + SMALL_WHEEL_RADIUS + wheelGap;
  midWheel.y = WHEEL_GROUND_Y - SMALL_WHEEL_RADIUS;
  frontWheel.x = midWheel.x + SMALL_WHEEL_RADIUS * 2 + wheelGap;
  frontWheel.y = midWheel.y;

  container.addChild(graphics, backWheel, midWheel, frontWheel);

  // For a rolling wheel, angular speed is inversely proportional to radius
  // (angular speed = linear speed / radius). Thus the larger wheel turns slower.
  app.ticker.add((time) => {
    const dr = time.deltaTime * 0.15;

    backWheel.rotation += dr * (SMALL_WHEEL_RADIUS / BIG_WHEEL_RADIUS);
    midWheel.rotation += dr;
    frontWheel.rotation += dr;
  });

  return container;
}


// Build one passenger carriage. Its local y = 0 line is the bottom edge of the
// body; wheel centers sit below that line so the body rests on the same wheels
// baseline as the engine.
function createTrainCarriage(app) {
  const container = new Container();

  // Body dimensions. Keep the body above y = 0; Pixi's positive y direction is down.
  const bodyHeight = 125;
  const bodyWidth = 200;
  const bodyRadius = 15;
  // The top trim overhangs the body by 10 px on each side.
  const edgeHeight = 25;
  const edgeExcess = 20;
  // Two small dark bars are decorative carriage fittings.
  const connectorWidth = 30;
  const connectorHeight = 10;
  const connectorGap = 10;
  const connectorOffsetY = 20;

  const graphics = new Graphics();

  // Body spans y = -bodyHeight..0, using roundRect because rect() has no
  // corner-radius parameter. The original y = -10 body extended downward and
  // covered the wheels; ending it at y = 0 aligns it with the engine body.
  graphics
    .roundRect(edgeExcess / 2, -bodyHeight, bodyWidth, bodyHeight, bodyRadius)
    .fill({ color: 0x725f19 });

  // The top trim caps the body. Its y is the body's top and its width includes
  // both overhangs: bodyWidth + edgeExcess.
  graphics
    .rect(0, -bodyHeight, bodyWidth + edgeExcess, edgeHeight)
    .fill({ color: 0x52431c });

  // Decorative fittings are placed near the left side of the carriage.
  graphics
    .rect(connectorWidth + edgeExcess / 2, -connectorOffsetY - connectorHeight, connectorWidth, connectorHeight)
    .rect(
      connectorWidth + edgeExcess / 2,
      -connectorOffsetY - connectorHeight * 2 - connectorGap,
      connectorWidth,
      connectorHeight,
    )
    .fill({ color: 0x121212 });

  const wheelRadius = SMALL_WHEEL_RADIUS;
  const wheelGap = 40;
  // Center the pair on the body, then move each center out by radius + half
  // the desired gap. This leaves wheelGap px between the wheel circumferences.
  const centerX = (bodyWidth + edgeExcess) / 2;
  const wheelOffsetX = wheelRadius + wheelGap / 2;

  const backWheel = createTrainWheel(wheelRadius);
  const frontWheel = createTrainWheel(wheelRadius);

  backWheel.x = centerX - wheelOffsetX;
  frontWheel.x = centerX + wheelOffsetX;
  // Wheel bottom = centerY + radius = WHEEL_GROUND_Y (60), same as engine.
  backWheel.y = frontWheel.y = WHEEL_GROUND_Y - wheelRadius;

  container.addChild(graphics, backWheel, frontWheel);

  // Both carriage wheels use the same angular speed because they have equal radii.
  app.ticker.add((time) => {
    const dt = time.deltaTime * 0.15;

    backWheel.rotation += dt;
    frontWheel.rotation += dt;
  });


  return container;
}



function createTrainWheel(radius) {
  // The tyre stroke is one-third of the radius, leaving the rest for the hub
  // and spokes. The spokes are drawn around (0, 0), the wheel's rotation pivot.
  const strokeThickness = radius / 3;
  const innerRadius = radius - strokeThickness;

  return new Graphics()
    .circle(0, 0, radius)
    .fill({ color: 0x848484 })
    .stroke({
      width: strokeThickness,
      alignment: 1,
      color: 0x121212,
    })
    .rect(-strokeThickness / 2, -innerRadius, strokeThickness, innerRadius * 2)
    .rect(-innerRadius, -strokeThickness / 2, innerRadius * 2, strokeThickness)
    .fill({ color: 0x4f4f4f });
}