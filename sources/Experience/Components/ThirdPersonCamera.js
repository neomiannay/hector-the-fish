import {CameraHelper, Vector3, Euler} from "three";
import Experience from "../Experience";
import lerp from "../Utils/lerp";

export default class ThirdPersonCamera {
    constructor() {
        this._experience = new Experience();
        this.camera = this._experience.camera;
        this.fov = new Vector3(this.camera.instance.fov);
        this.debug = this._experience.config.debug;
        this.newpos = new Vector3(0, 4.57, -14.78)
        this.idealLookAt = new Vector3(0, 1.30, 1.74)

        this.mouse = {
            x: 0,
            y: 0
        }

        this.getMousePos();

        if (this.debug) {
            this.setDebug()
        }
    }

    setDebug() {
        // Third Person Camera Position
        this.debugFolder = this._experience.debug.addFolder({
            title: 'TPC Position',
            expanded: true,
        });

        this.debugFolder
            .addBinding(this.newpos, 'x', { label: 'x', min: -10, max: 10, step: 0.01 })
            .on('change', ({value}) => {
                this.newpos.x = value;
            })

        this.debugFolder
            .addBinding(this.newpos, 'y', { label: 'y', min: -10, max: 10, step: 0.01 })
            .on('change', ({value}) => {
                this.newpos.y = value;
            })

        this.debugFolder
            .addBinding(this.newpos, 'z', { label: 'z', min: -40, max: 40, step: 0.01 })
            .on('change', ({value}) => {
                this.newpos.z = value;
            })

        // Third Person Camera LookAt
        this.debugFolder = this._experience.debug.addFolder({
            title: 'TPC LookAt',
            expanded: true,
        });

        this.debugFolder
            .addBinding(this.idealLookAt, 'x', { label: 'x', min: -10, max: 10, step: 0.01 })
            .on('change', ({value}) => {
                this.idealLookAt.x = value;
            })

        this.debugFolder
            .addBinding(this.idealLookAt, 'y', { label: 'y', min: -10, max: 10, step: 0.01 })
            .on('change', ({value}) => {
                this.idealLookAt.y = value;
            })

        this.debugFolder
            .addBinding(this.idealLookAt, 'z', { label: 'z', min: -10, max: 10, step: 0.01 })
            .on('change', ({value}) => {
                this.idealLookAt.z = value;
            })
    }

    getMousePos() {
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        });
    }

    updateLookAtPosition(p) {
        p.x += this.mouse.x * 0.02;
        p.y -= this.mouse.y * 0.02;
    }


    update() {
        // update fish position
        const relativeNewPoissonPos = this._experience.character_placeholder.localToWorld(new Vector3(0, 0, 0).copy(this.newpos));
        this._experience.camera.instance.position.copy(relativeNewPoissonPos)

        // update fish lookAt
        const relativeNewPoissonLookAt = this._experience.character_placeholder.localToWorld(new Vector3(0, 0, 0).copy(this.idealLookAt));
        this.updateLookAtPosition(relativeNewPoissonLookAt);
        this._experience.camera.instance.lookAt(
            relativeNewPoissonLookAt
        );
        this._experience.camera.instance.godRaysRotation = new Euler().setFromQuaternion(this._experience.camera.instance.quaternion);

        // update camera fov
        if(this._experience.scrollManager.options.isScrolling) {
            if (this._experience.scrollManager.options.scrollingDirection === 'down') {
                this.camera.instance.fov = lerp(
                    this.camera.instance.fov,
                    this.fov.x + 2,
                    this._experience.time.delta * 0.004
                );
            } else if(this._experience.scrollManager.options.scrollingDirection === 'up') {
                this.camera.instance.fov = lerp(
                    this.camera.instance.fov,
                    this.fov.x - 2,
                    this._experience.time.delta * 0.004
                );
            }
        } else {
            this.camera.instance.fov = lerp(
                this.camera.instance.fov,
                this.fov.x,
                this._experience.time.delta * 0.004
            );
        }

        this.camera.instance.updateProjectionMatrix();
    }
}