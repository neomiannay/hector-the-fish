import Experience from "../Experience";
import {AnimationMixer, BufferGeometry, CatmullRomCurve3, Line, Vector3} from "three";
import lerp from "../Utils/lerp";
import curve from '../curves/test-emie.json';
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
        this.instance.scene.name = 'character';


        this.mixer = new AnimationMixer(this.instance.scene);
        this.mixer.clipAction(this.instance.animations[0]).play();

        this.experience.character = this.instance.scene;
        this.experience.scene.add(this.instance.scene);
    }

    setCurve() {
        this.exportedCurve.forEach(point => {
            // Blender inverted Y and Z axis so we need to swap them
            point.pz = point.py;
            point.py = point.y;
            point.y = point.pz;
            this.splinePoints.push(new Vector3(point.px, point.py, point.pz));
            this.controlPoints.push({
                left: new Vector3(point.hlx, point.hly, point.hlz),
                right: new Vector3(point.hrx, point.hry, point.hrz)
            });
        });

        this.debug && console.log(this.splinePoints);
        this.debug && console.log(this.controlPoints);

        this.threeCurve = new CatmullRomCurve3(this.splinePoints);

        // To make the curve visible, we need to create a line and give it a material
        const geometry = new BufferGeometry().setFromPoints(this.threeCurve.getPoints(100));
        const material = new LineMaterial({
            color: 0xff0000,
            linewidth: 0.002,
            dashed: false,
            alphaToCoverage: true,
        });

        this.line = new Line(geometry, material);
        this.line.name = 'curve';
        this.experience.scene.add(this.line);

    }

    update() {
        this.mixer.update(this.experience.time.delta * 0.001);

        this.u = this.experience.scrollManager.options.progress / 100;

        const position = this.threeCurve.getPointAt(this.u);
        // const tangent = this.threeCurve.getTangentAt(this.u);

        const t = 1.0 - Math.pow(0.001, this.experience.time.elapsed);

        this.instance.scene.position.lerp(position, t);

        // Rotate the character to follow the tangent vertically and horizontally
        // const lookAhead = this.threeCurve.getPointAt((this.u + 0.05) % 1);
        // this.instance.scene.lookAt(lookAhead);

    }

    destroy() {
        this.instance.geometry.dispose();
        this.instance.material.dispose();
        this.experience.scene.remove(this.instance.scene);
    }
}