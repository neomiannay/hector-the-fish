import * as THREE from 'three'
import Experience from '../Experience.js'

import Caustics from '../Objects/Caustics.js'

import vertex from '../Shaders/caustics/vertex.glsl'
import fragment from '../Shaders/caustics/fragment.glsl'
import Boat from "../Objects/Boat";
import Character from "../Components/Character";
import {AxesHelper} from "three";

export default class Intro {
    constructor(_options)
    {
        this.experience = new Experience()
        // this.scrollManager = this.experience.scrollManager.options
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.camera = this.experience.camera

        this.terrain = {
            size: 10,
            x: 0,
            y: -0.5,
            z: -1,
        }


        this.setScene()
    }

    setScene()
    {
        this.boat = new Boat();
        this.character = new Character();


        const axisHelper = new AxesHelper(15)


        const light = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(light);

        this.setSand();
        this.setCaustics();
    }

    setCaustics()
    {
        this.causticGeo = new THREE.PlaneGeometry(this.terrain.size, this.terrain.size, 100, 100);
        this.causticMat = new Caustics({
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.4,
        });
        this.caustic = new THREE.Mesh(this.causticGeo, this.causticMat);
        this.caustic.rotation.set(Math.PI / 2, 0, 0);
        this.caustic.position.set(this.terrain.x, this.terrain.y + 0.01, this.terrain.z);

        this.scene.add(this.caustic);
    }

    setSand()
    {
        this.sand = new THREE.PlaneGeometry(this.terrain.size, this.terrain.size, 100, 100);
        this.sandMat = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            // sandNorma, sandDiffuse, sandAO
            map: this.resources.items.sandDiffuse,
            // normalMap: this.resources.items.sandNormal,
            aoMap: this.resources.items.sandAmbientOcclusion,
        });

        this.sandMesh = new THREE.Mesh(this.sand, this.sandMat);
        this.sandMesh.rotation.set(Math.PI / 2, 0, 0);
        this.sandMesh.position.set(this.terrain.x, this.terrain.y, this.terrain.z);

        this.scene.add(this.sandMesh);
    }

    update()
    {
        if(this.mixer)
        {
            this.mixer.update(this.experience.time.delta * 0.001);
        }

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