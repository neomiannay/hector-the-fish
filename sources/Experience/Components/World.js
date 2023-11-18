import * as THREE from 'three'
import Experience from '../Experience.js'

export default class World
{
    constructor(_options)
    {
        this.experience = new Experience()
        // this.scrollManager = this.experience.scrollManager.options
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.scenesSequence = {
          scene1: {
            start: 0,
            end: 75
          },
          scene2: {
            start: 75,
            end: 100
          }
        }


        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.setScene1()
            }
        })
    }

    setScene1()
    {
        this.fish = this.resources.items.fish;
        this.fish.scene.scale.set(0.2, 0.2, 0.2);
        this.fish.scene.rotation.set(0, Math.PI / 2, 0);

        this.animations = this.fish.animations;
        this.mixer = new THREE.AnimationMixer(this.fish.scene);
        this.mixer.clipAction(this.animations[0]).play();

        this.boat = this.resources.items.boat;
        this.boat.scene.scale.set(0.003, 0.003, 0.003);
        this.boat.scene.rotation.set(0, Math.PI / 2, 0);
        this.boat.scene.position.set(0, -.2, -2);

        const light = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(light);
        this.scene.add(this.fish.scene);
        this.scene.add(this.boat.scene);
    }

    resize()
    {
    }

    update()
    {
        if(this.mixer)
        {
            this.mixer.update(this.experience.time.delta * 0.001);
        }
    }

    destroy()
    {
    }
}