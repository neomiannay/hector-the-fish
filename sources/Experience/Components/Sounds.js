import Experience from "../Experience";
import {BoxGeometry, BoxHelper, Mesh, MeshBasicMaterial} from "three";

export default class Sounds {
    constructor() {
        this._experience = new Experience();
        this.debug = this._experience.debug;

        this.audioListener = this._experience.audioListener
        this._experience.camera.instance.add(this.audioListener);

        this.setSounds();
        this.setDebug();
    }

    setSounds() {
        // Global sounds
        this.ambientSound = this._experience.resources.items.mainMusic;
        this._experience.character.add(this.ambientSound);

        this.ambientSound.setLoop(true);
        this.ambientSound.setVolume(1);
        this.ambientSound.play();
    }

    setDebug() {
        if (this.debug) {
            this.PARAMS = {
                isActive: true,
                volume: this.ambientSound.getVolume(),
            }

            this.debugFolder = this.debug.addFolder({ title: "Sounds: Main Ambiance", expanded: true });

            this.debugFolder
                .addBinding(this.PARAMS, "isActive")
                .on("change", ({value}) => {
                    this.ambientSound.setVolume(value ? this.PARAMS.volume : 0);
                });

            this.debugFolder
                .addBinding(this.PARAMS, "volume", {min: 0, max: 1, step: 0.01})
                .on("change", ({value}) => {
                    this.ambientSound.setVolume(value);
                });
        }

    }

    linkSoundToMesh({mesh, sound, callback}){
        mesh.add(sound);

        if (callback) {
            callback();
        }
    }
}