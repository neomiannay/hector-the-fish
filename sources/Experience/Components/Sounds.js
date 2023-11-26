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

        this.algueFloor = this._experience.scene.children.find((child) => child.name === 'algueFloor');
        this.algueDescent = this._experience.scene.children.find((child) => child.name === 'algueDescent');

        console.log(this._experience.scene.children);
        console.log(this.algueFloor);
        console.log(this.algueDescent);

        this.algueDescent.children.sort(() => Math.random() - 0.5).slice(0, 3).forEach(algue => {
            this.linkSoundToMesh({
                mesh: algue,
                sound: this._experience.resources.items.plantSound,
                callback: () => {
                    this._experience.resources.items.plantSound.setLoop(true);
                    this._experience.resources.items.plantSound.setVolume(0.4);
                    this._experience.resources.items.plantSound.play();
                }
            });
        });

        this.algueFloor.children.sort(() => Math.random() - 0.5).slice(0, 6).forEach(algue => {
            this.linkSoundToMesh({
                mesh: algue,
                sound: this._experience.resources.items.plantSound,
                callback: () => {
                    this._experience.resources.items.plantSound.setLoop(true);
                    this._experience.resources.items.plantSound.setVolume(0.4);
                    this._experience.resources.items.plantSound.play();
                }
            });
        });


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

        /* Fear sound: 48% progress */
        this._experience.scrollManager.on(48, () => {
            this._experience.boat.add(this._experience.resources.items.boatGrincement);
            this._experience.resources.items.boatGrincement.setVolume(0.3)
            // place the sound to the right of the ear
            this._experience.resources.items.boatGrincement.play();
        });

        /* Fear sound: 60% progress */
        this._experience.scrollManager.on(60, () => {
            this._experience.resources.items.fishTalking.setVolume(0.3)
            this.ambientSound.setVolume(0.10);
            this.deepAmbientSound.setVolume(.5);
            this._experience.boat.add(this._experience.resources.items.bruitEffrayant);
            this._experience.resources.items.bruitEffrayant.setVolume(0.3)
            // place the sound to the right of the ear
            this._experience.resources.items.bruitEffrayant.position.set(25, 10, 0);
            this._experience.resources.items.bruitEffrayant.play();

            // after that we set back the volume of the ambient sound
            setTimeout(() => {
                this.ambientSound.setVolume(0.25);
                this.deepAmbientSound.setVolume(1);
            }, 2000)
        });

        /* Fish talking: 90% progress */
        this._experience.scrollManager.on(90, () => {
            this._experience.character.add(this._experience.resources.items.discoverCoquillage);
            this._experience.resources.items.fishTalking.setVolume(0.3)
            this.ambientSound.setVolume(0.10);
            this.deepAmbientSound.setVolume(.5);
            this._experience.resources.items.discoverCoquillage.setVolume(0.9)
            this._experience.resources.items.discoverCoquillage.setLoop(true);
            this._experience.resources.items.discoverCoquillage.position.set(0, 0, 5);
            this._experience.resources.items.discoverCoquillage.play();
        })

        /* Fish talking: 100% progress */
        this._experience.scrollManager.on(95, () => {
            this._experience.audioListener.setMasterVolume(0.2)
        })
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