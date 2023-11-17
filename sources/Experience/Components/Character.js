import Experience from "../Experience";
import {AnimationMixer, BufferGeometry, CatmullRomCurve3, Line, Vector3} from "three";
import lerp from "../Utils/lerp";
import curve from '../curves/test.json';
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";


export default class Character {
    constructor(_options = {}) {
        this.experience = new Experience();
        this.debug = this.experience.config.debug;
        this.time = this.experience.time;
        this.resources = this.experience.resources;

        this.splinePoints = [];
        this.controlPoints = [];
        this.exportedCurve = curve;


        this.u = 0;

        this.setInstance();
        this.setCurve();
    }

    setInstance() {
        this.debug && console.log('Character')

        this.instance = this.resources.items.fish;
        this.instance.scene.scale.set(0.2, 0.2, 0.2);
        this.instance.scene.position.set(2, 0, 0);
        this.instance.scene.rotation.set(0, Math.PI / 2, 0);

        this.mixer = new AnimationMixer(this.instance.scene);
        this.mixer.clipAction(this.instance.animations[0]).play();

        this.experience.scene.add(this.instance.scene);
    }

    setCurve() {
        this.exportedCurve.forEach(point => {
            this.splinePoints.push(new Vector3(point.px, point.py, point.pz));
            this.controlPoints.push({
                left: new Vector3(point.hlx, point.hly, point.hlz),
                right: new Vector3(point.hrx, point.hry, point.hrz)
            });
        });

        this.debug && console.log(this.splinePoints);
        this.debug && console.log(this.controlPoints);

        this.threeCurve = new CatmullRomCurve3(this.splinePoints);

        console.log(this.threeCurve);

        this.line = new Line(
            new BufferGeometry().setFromPoints(this.threeCurve.getPoints(100)),
            new LineMaterial({
                color: 0xff0000,
                linewidth: 1,
                dashed: false
            })
        );

        this.experience.scene.add(this.line);
    }

    update() {
        this.mixer.update(this.experience.time.delta * 0.001);

        const position = this.threeCurve.getPointAt(this.u);
        const tangent = this.threeCurve.getTangentAt(this.u);
        const angle = Math.atan2(tangent.z, tangent.x);

        this.instance.scene.position.copy(position);
        this.instance.scene.rotation.y = angle;
    }

    destroy() {
        this.instance.geometry.dispose();
        this.instance.material.dispose();
        this.experience.scene.remove(this.instance.scene);
    }
}