import {CameraHelper, Vector3} from "three";
import Experience from "../Experience";

export default class ThirdPersonCamera {
    constructor() {
        this._experience = new Experience();
        console.log(this._experience)
        this.camera = this._experience.camera;
        console.log(this.camera)
        this.debug = this._experience.config.debug;
        this.newpos = new Vector3(0, 2.2, -5)

        if (this.debug) {
            this.setDebug()
        }
    }

    setDebug() {
        this.debugFolder = this._experience.debug.addFolder({
            title: 'Third Person Camera',
            expanded: true,
        });

    }


    update() {
        // this._experience.camera.instance.position.copy(this._experience.character_placeholder.position).add(new Vector3(0, 1.2, -5))

        const localNewPos = new Vector3(0, 2.2, -5)
        const relativeNewPoissonPos = this._experience.character_placeholder.localToWorld(localNewPos);

        this._experience.camera.instance.position.copy(relativeNewPoissonPos)
        this._experience.camera.instance.lookAt(this._experience.character_placeholder.position);
    }
}