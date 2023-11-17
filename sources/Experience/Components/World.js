import * as THREE from 'three'
import Experience from '../Experience.js'
import Character from "./Character";

export default class World
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.scrollManager = this.experience.scrollManager.options
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
        this.fish = new Character();
        this.fish = this.resources.items.fish;
        this.fish.scene.scale.set(0.2, 0.2, 0.2);
        this.fish.scene.rotation.set(0, Math.PI / 2, 0);

        this.animations = this.fish.animations;
        this.mixer = new THREE.AnimationMixer(this.fish.scene);
        this.mixer.clipAction(this.animations[0]).play();

        const light = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(light);

        const cube1 = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({color: 0xff0000})
        );
        cube1.position.set(2, 0, 0);
        this.scene.add(cube1);

        const cube2 = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({color: 0x00ff00})
        );
        cube2.position.set(2, 0, -2);
        this.scene.add(cube2);
    }

    resize()
    {
    }

    update()
    {
        if(this.fish) {
            this.fish.update();
        }

        if(this.scene.children.length > 0)
        {
            this.scene.children.forEach(c => {
                if(c.name == 'sequence')
                {
                    console.log(c);
                    c.position.z = this.scrollManager.progress * 0.1;
                }
            })
        }
    }

    destroy()
    {
    }
}