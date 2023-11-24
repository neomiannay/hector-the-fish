import Experience from "../Experience";
import {AnimationMixer, AxesHelper, BufferGeometry, CatmullRomCurve3, Line, Vector3} from "three";
import lerp from "../Utils/lerp";
import curve from '../curves/turn-around-boat.json';
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";


export default class Character {
    constructor(_options = {}) {
        this.experience = new Experience();
        this.debug = this.experience.config.debug;
        this.resources = this.experience.resources;
        this.renderer = this.experience.renderer;

        this.u = 0;

        this.setInstance();
    }

    setInstance() {
        this.debug && console.log('Character')

        this.instance = this.resources.items.fish;

        this.instance.scene.add(new AxesHelper(15))
        this.instance.scene.name = 'character';

        this.instance.scene.scale.set(0.050, 0.05, 0.05);

        this.mixer = new AnimationMixer(this.instance.scene);
        this.mixer.clipAction(this.instance.animations[0]).play();

        this.experience.character = this.instance.scene;
        this.experience.scene.add(this.instance.scene);
    }

    update() {
        this.mixer.update(this.experience.time.delta * 0.001);

        if (this.experience.character_placeholder) {
            this.instance.scene.position.copy(this.experience.character_placeholder.position);
            this.instance.scene.rotation.copy(this.experience.character_placeholder.rotation);
        }
    }

    destroy() {
        this.instance.geometry.dispose();
        this.instance.material.dispose();
        this.experience.scene.remove(this.instance.scene);
    }
}