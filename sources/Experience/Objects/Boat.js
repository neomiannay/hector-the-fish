import Experience from "../Experience";
import {AnimationMixer} from "three";

export default class Boat {
    constructor() {
        this._experience = new Experience();

        this.init();
    }

    init() {
        this.instance = this._experience.resources.items.boat.scene;

        this.boatCurve = this._experience.resources.items.boatCurve;
        console.log(this.boatCurve)

        this._mixer = new AnimationMixer(this.boatCurve.scene);
        this.action = this._mixer.clipAction(this.boatCurve.animations[1]);
        this.action.play();

        this._experience.scene.add(this.instance);
        this._experience.scene.add(this.boatCurve.scene);

        this.animationDuration = this.action.getClip().duration;

        this._experience.character_placeholder = this.boatCurve.scene.getObjectByName('HiddenCube');
        this._experience.character_placeholder.material.visible = false;

        this._experience.boat = this.instance;
    }

    update() {
        const scrollProgress = this._experience.scrollManager.options.progress;
        this.action.time = (scrollProgress / 100) * this.animationDuration;

        this._mixer.update(0);
    }
}