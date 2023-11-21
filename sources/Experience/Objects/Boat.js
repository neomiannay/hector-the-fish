import Experience from "../Experience";
import {AnimationMixer} from "three";

export default class Boat {
    constructor() {
        this._experience = new Experience();

        this.init();
    }

    init() {
        this.instance = this._experience.resources.items.boatAnim.scene;
        this._mixer = new AnimationMixer(this.instance);
        this.action = this._mixer.clipAction(this._experience.resources.items.boatAnim.animations[0]);
        this.action.play();

        this._experience.scene.add(this.instance);

        this.animationDuration = this.action.getClip().duration;

        this._experience.character_placeholder = this.instance.getObjectByName('HiddenCube');
        this._experience.character_placeholder.material.visible = true;
    }

    update() {
        const scrollProgress = this._experience.scrollManager.options.progress;
        this.action.time = (scrollProgress / 100) * this.animationDuration;

        this._mixer.update(0);
    }
}