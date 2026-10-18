import { Graphics } from 'pixi.js';

export function addStars(app) {

    // Define the number of stars
    const starCount = 20;
    const graphics = new Graphics();

    /*  
        Graphics API has star(x, y, points, radius, innerRadius?, rotation?) 
    */

        for (let i = 0; i < starCount; i++) {
            const x = (i * 0.786 * app.screen.width) % app.screen.width;
            const y = (i * 0.938 * app.screen.height) % app.screen.height;

            const radius = 2 + Math.random() * 3;
            const rotation = Math.random() * Math.PI * 2;

            graphics.star(x, y, 5, radius, 0, rotation);
            graphics.fill({
                color: 0xffffff,
            });
        }

        app.stage.addChild(graphics);
}