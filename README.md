# Choo Choo Train

A small PixiJS scene that draws a train moving through a night landscape. The
scene is written in JavaScript and uses PixiJS `Graphics` objects instead of
individual image sprites for most of its shapes.

## Run it

From this project directory:

```sh
npm install
npm run dev
```

Vite prints a local address to open in your browser. To make a production build,
run `npm run build`; to serve that build locally, run `npm run preview`.

## How the project is put together

- `index.html` loads `src/main.js`.
- `src/main.js` creates the PixiJS `Application`, initializes it, and calls the
  functions that add the stars, moon, mountains, trees, ground, and train.
- `src/addSmokes.js` makes semi-transparent smoke puffs that rise from the train.
- Each scene module creates its drawing objects and adds them to `app.stage`.
- The train parts are grouped in a `Container`, so the locomotive and carriage
  can be positioned and scaled together.
- `src/assets/moon.svg` is the moon drawing imported by `src/moon.js`.
- `src/style.css` contains page styles from the Vite starter template. The
  animated scene itself is drawn by PixiJS on its canvas.

## PixiJS terms used in this project

### Application, stage, and canvas

- `new Application()` creates the PixiJS application.
- `app.init({...})` prepares the renderer. `resizeTo: window` makes its screen
  follow the browser window.
- `app.canvas` is the HTML canvas element where Pixi renders the scene.
- `app.stage` is the root container for visible objects. `app.stage.addChild(...)`
  adds objects to it. Objects added later are generally drawn in front of
  objects added earlier.

### Containers and display-object properties

- `new Container()` groups display objects. Moving or scaling a container
  affects its children as a group.
- `.x` and `.y` set an object's position. The origin `(0, 0)` is at the top-left
  of the screen, and positive y points down.
- `.scale.set(number)` sets horizontal and vertical scale together. For example,
  `container.scale.set(0.75)` draws the train at 75% of its local size.
- `.rotation` is the angle of an object in radians. The train wheels rotate by
  incrementing this value each animation frame.
- `.alpha` controls transparency, from `0` (invisible) to `1` (fully opaque).
  The smoke sets `.alpha` as it moves, so each puff fades away. Fill styles can
  also have an `alpha` value to make the original smoke circles translucent.

### Drawing with `Graphics`

- `new Graphics()` creates a drawable shape object.
- `.rect(x, y, width, height)` draws a rectangle. `.roundRect(...)` draws a
  rectangle with rounded corners, and `.circle(x, y, radius)` draws a circle.
- `.moveTo(...)` and `.lineTo(...)` define a path using points.
- `.bezierCurveTo(...)` and `.quadraticCurveTo(...)` add curved sections to a
  path.
- `.star(x, y, points, radius, innerRadius, rotation)` draws a star.
- `.svg(markup)` turns SVG markup into Pixi graphics.
- `.fill({ color })` fills the current shape/path. Colors in the scene are
  hexadecimal numbers such as `0xffffff` for white.
- `.stroke({ color, width, ... })` draws an outline around a shape.
- Drawing methods can be chained because they return the `Graphics` object.
  For example, `graphics.rect(...).fill(...)` draws and colors a rectangle.

### Animation with the ticker

`app.ticker.add(callback)` registers a function that Pixi calls every frame.
The callback receives `time`; `time.deltaTime` represents the elapsed frame
time in Pixi's frame units. Multiplying a movement amount by `deltaTime` makes
animation progress according to elapsed time rather than simply moving once
per callback.

The train's bob uses a sine wave:

```text
offset = (sin(elapsed * 0.5 * speed) * 0.5 + 0.5) * shakeDistance
```

`sin(...)` ranges from `-1` to `1`. Multiplying by `0.5` and adding `0.5`
converts that to `0..1`; multiplying by `shakeDistance` converts it to a
smooth `0..shakeDistance` pixel offset.

## Understanding the train measurements

Pixi draws objects using local coordinates. In the train, negative y values
draw above the train's origin, and positive y values draw below it. The engine's
large wheel establishes a common wheel-bottom line:

```text
wheel bottom = wheel center y + wheel radius
             = 5 + 55
             = 60 local pixels
```

For a wheel to touch that line, calculate its center as:

```text
wheel center y = shared wheel-bottom y - wheel radius
```

So a 39 px wheel has center y `60 - 39 = 21`. The carriage uses this same
calculation so its wheels align with the engine's.

Other measurements in `src/train.js` are relative to nearby shapes:

- The chimney top is wider than its base. Its horizontal overhang on each side
  is `(top width - base width) / 2`.
- The door is `70%` of the cabin's width and height; its x coordinate centers
  it in the cabin with `(cabin width - door width) / 2`.
- The window width is `80%` of the door width, with its x offset calculated
  from the leftover space so it is centered.
- The carriage wheel pair is centered at `(body width + trim overhang) / 2`.
  Each wheel center is offset from that midpoint by `wheel radius + gap / 2`,
  leaving the requested gap between the outside edges of the wheels.
- For wheels rolling at the same linear speed, angular speed is inversely
  proportional to radius. The large engine wheel therefore rotates at the
  small-to-large radius ratio.

## Scene modules

- `src/stars.js` places white stars across the screen.
- `src/moon.js` loads and positions the SVG moon.
- `src/mountains.js` creates the distant, scrolling mountain shapes.
- `src/trees.js` builds layered trees and scrolls them past the train.
- `src/ground.js` draws the snow, sleepers, and rail; the sleepers loop to
  create the impression of movement.
- `src/train.js` draws the locomotive, carriage, and rotating wheels.
- `src/addSmokes.js` draws and animates the train's rising smoke puffs.
