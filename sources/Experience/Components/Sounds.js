import Experience from "../Experience";

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
        this.ambientSound.setVolume(0.25);
        this.ambientSound.play();

        this.deepAmbientSound = this._experience.resources.items.deepTheme;
        this.deepAmbientSound.setLoop(true);
        this.deepAmbientSound.setVolume(1);
        this.deepAmbientSound.play();
        this._experience.character.add(this.deepAmbientSound);

        /* Fish talking: 10% progress */
        this._experience.scrollManager.on(10, () => {
            this._experience.character.add(this._experience.resources.items.fishTalking);
            this._experience.resources.items.fishTalking.setVolume(0.6)
            this._experience.resources.items.fishTalking.play();
        });

        /* Fear sound: 20% progress */
        this._experience.scrollManager.on(20, () => {
            this._experience.character.add(this._experience.resources.items.fearSound);
            this._experience.resources.items.fearSound.setVolume(0.5)
            // place the sound to the right of the ear
            this._experience.resources.items.fearSound.position.set(20, 0, -5);
            this._experience.resources.items.fearSound.play();
        });
    }

    setDebug() {
        if (this.debug) {
            this.PARAMS = {
                isActive: true,
                volume: this.ambientSound.getVolume(),
            }

            this.debugFolder = this.debug.addFolder({title: "Sounds: Main Ambiance", expanded: true});

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