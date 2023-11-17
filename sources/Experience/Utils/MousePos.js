import {Vector2} from "three";
import Experience from "../Experience";

export default class MousePos {

    constructor() {
        this.x = 0;
        this.y = 0;
        this.mouse = new Vector2();
        this.experience = new Experience();

        this.setEvents();
    }

    setEvents() {
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = parseFloat((event.clientX / this.experience.config.width).toFixed(2));
            this.mouse.y = parseFloat((event.clientY / this.experience.config.height).toFixed(2));
        });
    }

    update(){
        this.x = this.mouse.x;
        this.y = this.mouse.y;
    }
}