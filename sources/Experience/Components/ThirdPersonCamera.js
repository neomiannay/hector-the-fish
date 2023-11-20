import {Vector3} from "three";
import Experience from "../Experience";

export default class ThirdPersonCamera {
    constructor(params) {
        this._params = params;
        this._experience = new Experience();
        this._currentPosition = new Vector3();
        this._currentLookAt = new Vector3();
    }

    _calculateIdealOffset() {
        // Order is ZYX for camera
        const idealOffset = new Vector3(-7, 2, 0);

        idealOffset.applyQuaternion(this._experience.character.quaternion);
        idealOffset.add(this._experience.character.position);
        return idealOffset;
    }

    _calculateIdealLookat() {
        // Order is ZYX for camera
        const idealLookat = new Vector3(0, 1, 0);
        // console.log('idealLookat', idealLookat)
        idealLookat.applyQuaternion(this._experience.character.quaternion);
        idealLookat.add(this._experience.character.position);
        // console.log('idealLookat', idealLookat)
        return idealLookat;
    }

    update() {
        const idealOffset = this._calculateIdealOffset();
        const idealLookAt = this._calculateIdealLookat();

        const t = 0.05 * this._experience.time.delta;


        this._currentPosition.lerp(idealOffset, 0.5);
        this._currentLookAt.lerp(idealLookAt, 0.5);

        this._experience.camera.instance.position.copy(this._currentPosition);
        this._experience.camera.instance.lookAt(this._currentLookAt);

        // console.log('camera',this._experience.camera.instance.position)
        // console.log('character',this._experience.character.position)
    }
}