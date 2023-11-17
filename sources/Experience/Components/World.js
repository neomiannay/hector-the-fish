import * as THREE from 'three'
import Experience from '../Experience.js'

export default class World
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.setScene()
            }
        })
    }

    setScene()
    {   
        this.fish = this.resources.items.fish;
        this.fish.scene.scale.set(0.2, 0.2, 0.2);
        this.fish.scene.position.set(0, 0, 0);
        this.fish.scene.rotation.set(0, Math.PI / 2, 0);

        this.animations = this.fish.animations;
        this.mixer = new THREE.AnimationMixer(this.fish.scene);
        this.mixer.clipAction(this.animations[0]).play();

        const light = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(light);
        this.scene.add(this.fish.scene);
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