import * as THREE from 'three'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

import Experience from '../Experience.js'

import Caustics from '../Objects/Caustics.js'

import vertex from '../Shaders/caustics/vertex.glsl'
import fragment from '../Shaders/caustics/fragment.glsl'
import Boat from "../Objects/Boat";
import Character from "../Components/Character";
import {AxesHelper} from "three";
import Sounds from "../Components/Sounds";

import { gsap } from 'gsap';
import lerp from '../Utils/lerp.js'

export default class Intro {
    constructor(_options)
    {
        this.experience = new Experience()
        this.scrollManager = this.experience.scrollManager
        this.config = this.experience.config
        this.debug = this.experience.config.debug;
        this.debugFolder = this.experience.debug
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.resources = this.experience.resources
        this.camera = this.experience.camera
        this.fog = this.experience.fog

        this.terrain = {
            size: 60,
            x: 0,
            y: -0.5,
            z: -1,
        }


        this.setScene();
    }

    setScene()
    {
        // Set the scene elements
        this.boat = new Boat();
        this.character = new Character();
        this.algue = this.resources.items.algue.scene

        const light = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(light);

        if (this.debug) {
            const axesHelper = new AxesHelper(15);
            this.scene.add(axesHelper);
        }

        
        this.setSand();
        this.setCaustics();
        this.setAlgue();
        
        this.setSounds();
    }

    setAlgue() {
        this.algue = this.resources.items.algue.scene;

        this.positions = [
            { x: -7.5, z: -2.5 },
            { x: -2, z: -10 },
            { x: 2.5, z: -5 },
            { x: 6.5, z: -8.25 },
            { x: -2, z: 2 },
            { x: 2.25, z: 3.5 },
            { x: 0, z: 10 },
            { x: 4.5, z: 7.75 },
            { x: -4.5, z: 8.25 },
            { x: -4, z: 7 },
            { x: 8, z: 1 },
            { x: -6, z: -4.5 },
            { x: -3.5, z: -6.5 },
            { x: -8.5, z: -9.5 },
        ];

        this.algueFloor = new THREE.Group();
        this.algueFloor.name = 'algueFloor';
        this.positions.forEach((position) => {
            const algue = this.algue.clone();
            algue.position.set(position.x, -.5, position.z);
            algue.rotation.set(0, Math.random() * Math.PI, 0);
            algue.scale.set(
                lerp(1.2, 2.5, Math.random()),
                lerp(1.2, 2.5, Math.random()),
                lerp(1.2, 2.5, Math.random()),
            );
            this.algueFloor.add(algue);
        })
        this.scene.add(this.algueFloor);


        this.descentPosition = [
            { x: 1.5, y: 40, z: -8 },
            { x: -2, y: 33, z: -8 },
            { x: 1.5, y: 30, z: -7.5 },
            { x: 1.25, y: 24, z: -7 },
            { x: -1.25, y: 12, z: -6.5 },
            { x: -1.75, y: 12, z: -5.75 },
            { x: 1.5, y: 8, z: -4 },
            { x: 1.25, y: 6, z: -4 },
        ]

        this.algueDescent = new THREE.Group();
        this.algueDescent.name = 'algueDescent';
        this.descentPosition.forEach((position) => {
            const algue = this.algue.clone();
            algue.position.set(position.x, position.y, position.z);
            algue.rotation.set(Math.PI / 4, Math.random() * Math.PI, 0);
            algue.scale.set(
                lerp(1.2, 2.5, Math.random()),
                lerp(1.2, 2.5, Math.random()),
                lerp(1.2, 2.5, Math.random()),
            );
            this.algueDescent.add(algue);
        })
        this.scene.add(this.algueDescent);
    }

    setSounds() {
        this.soundsManager = new Sounds();
    }

    setCaustics()
    {
        this.causticGeo = new THREE.PlaneGeometry(this.terrain.size, this.terrain.size, 100, 100);
        this.causticMat = new Caustics({
            side: THREE.FrontSide,
            transparent: true,
            opacity: 0.5
        });
        this.caustic = new THREE.Mesh(this.causticGeo, this.causticMat);
        this.caustic.rotation.set(-Math.PI / 2, 0, 0);
        this.caustic.position.set(this.terrain.x, this.terrain.y + 0.01, this.terrain.z);
        this.caustic.renderOrder = 1;

        this.scene.add(this.caustic);
    }

    setSand()
    {
        this.texture = this.resources.items.sandDiffuse;
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;
        this.texture.repeat.set(6, 6);

        this.sand = new THREE.PlaneGeometry(this.terrain.size, this.terrain.size, 100, 100);
        this.sandMat = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: this.resources.items.sandDiffuse,
            aoMap: this.resources.items.sandAmbientOcclusion,
        });

        this.sandMesh = new THREE.Mesh(this.sand, this.sandMat);
        this.sandMesh.rotation.set(Math.PI / 2, 0, 0);
        this.sandMesh.position.set(this.terrain.x, this.terrain.y, this.terrain.z);

        this.scene.add(this.sandMesh);
    }

    update()
    {

        if(this.causticMat)
        {
            this.causticMat.update(
                performance.now() * 0.001,
                this.config.width,
                this.config.height,
            )
        }

        if(this.character) {
            this.character.update();
        }

        if(this.boat) {
            this.boat.update();
        }
    }

}