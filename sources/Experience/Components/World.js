import * as THREE from 'three'
import Experience from '../Experience.js'
import Character from "./Character";
import Boat from "../Objects/Boat";
import {AxesHelper} from "three";

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
        this.character = new Character();
        this.boat = new Boat();


        const axisHelper = new AxesHelper(15)


        const light = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(light);
    }

    resize()
    {
    }

    update()
    {
        if(this.character) {
            this.character.update();
        }

        if(this.boat) {
            this.boat.update();
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