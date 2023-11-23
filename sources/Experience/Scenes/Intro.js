import * as THREE from 'three'
import Experience from '../Experience.js'

import Caustics from '../Objects/Caustics.js'

import vertex from '../Shaders/caustics/vertex.glsl'
import fragment from '../Shaders/caustics/fragment.glsl'
import Boat from "../Objects/Boat";
import Character from "../Components/Character";
import {AxesHelper} from "three";

import { gsap } from 'gsap';
import lerp from '../Utils/lerp.js'

export default class Intro {
    constructor(_options)
    {
        this.experience = new Experience()
        // this.scrollManager = this.experience.scrollManager.options
        this.config = this.experience.config
        this.debug = this.experience.config.debug;
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.resources = this.experience.resources
        this.camera = this.experience.camera
        this.fog = this.experience.fog.instance

        this.terrain = {
            size: 60,
            x: 0,
            y: -0.5,
            z: -1,
        }

        this.startBtn = document.querySelector('.mask');

        this.setScene();
        this.setupAnimation();
    }

    setScene()
    {
        // Set the scene elements
        this.boat = new Boat();
        this.character = new Character();

        const light = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(light);

        if (this.debug) {
            const axesHelper = new AxesHelper(15);
            this.scene.add(axesHelper);
        }

        this.setSand();
        this.setCaustics();
    }

    setupAnimation() {
        this.startBtn.addEventListener('click', () => {
            const targetFar = 50;
            const duration = 2.5;

            gsap.to(this.fog, {
                far: targetFar,
                duration: duration,
                onUpdate: () => {
                    this.scene.fog = new THREE.Fog(this.fog.color, this.for.near, this.fog.far);
                }
            });

            gsap.to(this.startBtn, {
                opacity: 0,
                y: -50,
                duration: .5,
                ease: 'power2.intOut',
                onComplete: () => {
                    this.startBtn.style.display = 'none';
                }
            });
            
        });
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