import { Graphics } from 'pixi.js';
import moonSvg from './assets/moon.svg?raw';

export function addMoon(app) {
    
    const graphics = new Graphics().svg(moonSvg);

    graphics.x = app.screen.width / 2 + 100;
    graphics.y = app.screen.height / 8;

    app.stage.addChild(graphics);
}
