import * as THREE from 'three'
import Experience from '../Experience.js'

import vertex from '../Shaders/caustics/vertex.glsl'
import fragment from '../Shaders/caustics/fragment.glsl'

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
        const light = new THREE.AmbientLight(0xffffff, 1);

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


        this.causticGeo = new THREE.PlaneGeometry(this.terrain.size, this.terrain.size, 100, 100);
        this.causticMat = new THREE.ShaderMaterial({
            transparent: true,
            side: THREE.DoubleSide,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new THREE.Vector2() },
            },
            vertexShader: vertex,
            fragmentShader: fragment
        });
        this.caustic = new THREE.Mesh(this.causticGeo, this.causticMat);
        this.caustic.rotation.set(Math.PI / 2, 0, 0);
        this.caustic.position.set(this.terrain.x, this.terrain.y + 0.01, this.terrain.z);


        this.scene.add(light);
        this.scene.add(this.fish.scene);
        this.scene.add(this.boat.scene);
        this.scene.add(this.caustic);

        this.setSand();
    }

    setSand()
    {
        this.sand = new THREE.PlaneGeometry(this.terrain.size, this.terrain.size, 100, 100);
        this.sandMat = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            normalMap: this.resources.items.sandNormal,
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
        if(this.mixer)
        {
            this.mixer.update(this.experience.time.delta * 0.001);
        }

        if(this.causticMat)
        {
            this.causticMat.uniforms.uTime.value = performance.now() * 0.001;
            this.causticMat.uniforms.uResolution.value.copy(
                new THREE.Vector2(window.innerWidth, window.innerHeight)
            );
        }
    }

}