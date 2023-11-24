import * as THREE from 'three'
import Experience from '../Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {CameraHelper} from "three";

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
        this.mode = 'follow' // followCamera \ debugCamera

        this.group = new THREE.Group()

        this.setInstance()
        // this.setGodRay()

        if (this.debug) {
            this.setDebug()
        }

        this.scene.add(this.group)
    }

    setInstance()
    {
        // Set up
        if (this.mode === 'debug') {
            this.initDebugCamera();
        } else {
            this.initFollowCamera();
        }
    }

    initFollowCamera() {
        this.instance = new THREE.PerspectiveCamera(25, this.config.width / this.config.height, 0.1, 150)
        this.instance.position.set(0, 1.2, 0)
        this.group.add(this.instance)
    }

    initDebugCamera() {
        this.instance = new THREE.PerspectiveCamera(25, this.config.width / this.config.height, 0.1, 150)
        this.instance.rotation.reorder('YXZ')
        this.instance.rotation.set(-Math.PI * .04, 0, 0);
        this.instance.lookAt(this.scene.position)
        this.instance.orbitControls = new OrbitControls(this.instance, this.targetElement)
        this.instance.position.set(0, 30, 10)
        this.instance.orbitControls.enabled = true
        this.instance.orbitControls.screenSpacePanning = true
        this.instance.orbitControls.enableKeys = false
        this.instance.orbitControls.enableZoom = false
        // this.modes.debug.orbitControls.zoomSpeed = 0.25
        this.instance.orbitControls.enableDamping = true
        this.instance.orbitControls.update()
    }

    setGodRay()
    {
        this.plane = new THREE.PlaneGeometry(4, 2)
        this.planeMaterial = new THREE.ShaderMaterial({
            transparent: true,
            side: THREE.FrontSide,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new THREE.Vector2() },
                uCameraRotation: { value: new THREE.Vector3() },
            },
            vertexShader: vertex,
            fragmentShader: fragment,
            // depthWrite: false,
            // depthTest: false,
        })
        
        this.godRay = new THREE.Mesh(this.plane, this.planeMaterial)
        this.godRay.frustumCulled = false
        this.godRay.renderOrder = 2

        this.group.add(this.godRay)
    }

    setDebug() {

        this.PARAMS = {
            mode: this.mode,
        }

        this.debugFolder = this.debug.addFolder({
            title: 'Camera',
            expanded: true,
        })

        this.debugFolder
            .addBinding(this.PARAMS, 'mode', {
                options: {
                    debug: 'debug',
                    follow: 'follow',
                }
            })
            .on('change', () => {
                this.mode = this.PARAMS.mode

                if (this.mode === 'debug') {
                    this.initDebugCamera();
                }
            })

    }


    resize()
    {
        this.instance.aspect = this.config.width / this.config.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {

        // Update debug orbit controls
        if (this.mode === 'debug') {
            this.instance.orbitControls.update()
        }

        // Apply coordinates
        // this.instance.position.copy(this.modes[this.mode].instance.position)
        // this.instance.quaternion.copy(this.modes[this.mode].instance.quaternion)
        this.instance.updateMatrixWorld() // To be used in projection

        // Update camera helper
        if (this.debug && this.cameraHelper) {
            this.cameraHelper.update()
        }

        // Update godray
        if(this.godRay)
        {
            this.planeMaterial.uniforms.uTime.value = this.time.delta * 0.001
            this.planeMaterial.uniforms.uResolution.value.set(this.config.width, this.config.height)
            this.planeMaterial.uniforms.uCameraRotation.value.copy(this.instance.rotation)
        }

        // Update camera helper
        // if (this.debug) {
        //     this.cameraHelper.update()
        // }
    }

    destroy()
    {
        this.modes.debug.orbitControls.destroy()
    }
}
