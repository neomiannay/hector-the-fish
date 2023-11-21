import {Vector3} from "three";
import Experience from "../Experience";

export default class ThirdPersonCamera {
    constructor() {
        this._experience = new Experience();
        console.log(this._experience)
    }

    _calculateOffsetPosition() {
        const offset = new Vector3(-15, 0, 0);
        const offsetPosition = this._experience.character_placeholder.position.clone().add(offset);

        return offsetPosition;
    }

    update() {
        const offsetPosition = this._calculateOffsetPosition();

        this._experience.camera.instance.position.copy(offsetPosition);
        this._experience.camera.instance.lookAt(this._experience.character.position);
    }
}