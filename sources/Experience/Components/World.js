import * as THREE from 'three'
import Experience from '../Experience.js'
import Character from "./Character";

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
        this.fish = new Character();

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
    }

    destroy()
    {
    }
}