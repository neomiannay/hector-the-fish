import * as THREE from 'three'
import Experience from '../Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import vertex from '../Shaders/godray/vertex.glsl'
import fragment from '../Shaders/godray/fragment.glsl'

export default class Camera
{
    constructor(_options)
    {
        // Options
        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.targetElement = this.experience.targetElement
        this.scene = this.experience.scene

        // Set up
        this.mode = 'debug' // defaultCamera \ debugCamera

        this.group = new THREE.Group()

        this.setInstance()
        this.setGodRay()
        this.setModes()

        this.scene.add(this.group)
    }

    setInstance()
    {
        // Set up
        this.instance = new THREE.PerspectiveCamera(25, this.config.width / this.config.height, 0.1, 150)
        this.group.add(this.instance)
    }

    setGodRay()
    {
        this.plane = new THREE.PlaneGeometry(4, 2)
        this.planeMaterial = new THREE.ShaderMaterial({
            transparent: true,
            side: THREE.DoubleSide,
            uniforms: {
                uResolution: { value: new THREE.Vector2() },
                uTime: { value: 0 },

            },
            vertexShader: vertex,
            fragmentShader: fragment,
        })

        this.godRay = new THREE.Mesh(this.plane, this.planeMaterial)
        
        this.group.add(this.godRay)
    }

    setModes()
    {
        this.modes = {}

        // Default
        this.modes.default = {}
        this.modes.default.instance = this.instance.clone()
        this.modes.default.instance.rotation.reorder('YXZ')
        this.modes.default.instance.position.set(0, .7, 5)
        this.modes.default.instance.rotation.set(-Math.PI * .04, 0, 0);

        // Debug
        this.modes.debug = {}
        this.modes.debug.instance = this.instance.clone()
        this.modes.debug.instance.rotation.reorder('YXZ')
        this.modes.debug.instance.position.set(0, .7, 5)
        this.modes.debug.instance.rotation.set(-Math.PI * .04, 0, 0);

        // this.modes.debug.instance.lookAt(this.scene.position)

        this.modes.debug.orbitControls = new OrbitControls(this.modes.debug.instance, this.targetElement)
        this.modes.debug.orbitControls.enabled = this.modes.debug.active
        this.modes.debug.orbitControls.screenSpacePanning = true
        this.modes.debug.orbitControls.enableKeys = false
        this.modes.debug.orbitControls.enableZoom = false
        // this.modes.debug.orbitControls.zoomSpeed = 0.25
        this.modes.debug.orbitControls.enableDamping = true
        this.modes.debug.orbitControls.update()
    }


    resize()
    {
        this.instance.aspect = this.config.width / this.config.height
        this.instance.updateProjectionMatrix()

        this.modes.default.instance.aspect = this.config.width / this.config.height
        this.modes.default.instance.updateProjectionMatrix()

        this.modes.debug.instance.aspect = this.config.width / this.config.height
        this.modes.debug.instance.updateProjectionMatrix()
    }

    update()
    {
        if(this.modes.debug) {
            this.modes.debug.orbitControls.update()
    
            // Apply coordinates
            this.instance.position.copy(this.modes[this.mode].instance.position)
            this.instance.quaternion.copy(this.modes[this.mode].instance.quaternion)
            this.instance.updateMatrixWorld() // To be used in projection
        }

        // Apply uiniforms
        this.planeMaterial.uniforms.uTime.value = performance.now() / 1000;
        this.planeMaterial.uniforms.uResolution.value.copy(
            new THREE.Vector2(window.innerWidth, window.innerHeight)
        );

        // Apply coordinates
        // this.godRay.position.copy(
        //     new THREE.Vector3(
        //         0,
        //         0,
        //         - 5
        //     )
        // )
        this.godRay.rotation.copy(this.instance.rotation)
    }

    destroy()
    {
        this.modes.debug.orbitControls.destroy()
    }
}
