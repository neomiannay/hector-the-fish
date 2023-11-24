import * as THREE from 'three'
import Experience from '../Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import vertex from '../Shaders/godray/vertex.glsl'
import fragment from '../Shaders/godray/fragment.glsl'
import wsFragment from '../Shaders/whiteScreen/fragment.glsl'

export default class Camera
{
    constructor(_options)
    {
        // Options
        this.experience = new Experience()
        this.scrollManager = this.experience.scrollManager
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
        this.setGodRay()
        this.setWhiteScreen()

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
        this.instance.godRaysRotation = new THREE.Euler().fromArray([0, 0, 0])
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
        this.grPlane = new THREE.PlaneGeometry(4, 2)
        this.grPlaneMaterial = new THREE.ShaderMaterial({
            transparent: true,
            side: THREE.FrontSide,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new THREE.Vector2() },
                uCameraRotation: { value: new THREE.Vector3() },
            },
            vertexShader: vertex,
            fragmentShader: fragment,
        })
        
        this.godRay = new THREE.Mesh(this.grPlane, this.grPlaneMaterial)
        this.godRay.frustumCulled = false
        this.godRay.renderOrder = 2

        this.group.add(this.godRay)
    }

    setWhiteScreen()
    {
        this.wsPlane = new THREE.PlaneGeometry(4, 2)
        this.wsPlaneMaterial = new THREE.ShaderMaterial({
            transparent: true,
            side: THREE.DoubleSide,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new THREE.Vector2() },
                uProgress: { value: 0 },
            },
            vertexShader: vertex,
            fragmentShader: wsFragment,
        })
        this.whiteScreen = new THREE.Mesh(this.wsPlane, this.wsPlaneMaterial)
        this.whiteScreen.frustumCulled = false
        this.whiteScreen.renderOrder = 3

        this.group.add(this.whiteScreen)
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
        this.instance.updateMatrixWorld() // To be used in projection

        // Update godray
        if(this.godRay)
        {
            this.grPlaneMaterial.uniforms.uTime.value = this.time.delta * 0.001
            this.grPlaneMaterial.uniforms.uResolution.value.set(this.config.width, this.config.height)

            if (this.experience.isStarted) {
                this.grPlaneMaterial.uniforms.uCameraRotation.value.copy(this.instance.godRaysRotation)
            }
        }
        if(this.whiteScreen)
        {
            this.wsPlaneMaterial.uniforms.uTime.value = this.time.delta * 0.001
            this.wsPlaneMaterial.uniforms.uResolution.value.set(this.config.width, this.config.height)
            this.wsPlaneMaterial.uniforms.uProgress.value = this.scrollManager.progress ? this.scrollManager.progress / 100 : 0;
        }
    }

    destroy()
    {
        this.modes.debug.orbitControls.destroy()
    }
}
