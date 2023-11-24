import * as THREE from 'three'
import { Pane } from 'tweakpane';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';

import Time from './Utils/Time.js'
import Sizes from './Utils/Sizes.js'
import Stats from './Utils/Stats.js'
import ScrollManager from './Hooks/ScrollManager.js';

import Resources from './Components/Resources.js'
import Renderer from './Components/Renderer.js'
import Camera from './Components/Camera.js'
import Fog from './Components/Fog.js';
import World from './Components/World.js'

import assets from './assets.js'
import MousePos from "./Utils/MousePos";
import ThirdPersonCamera from "./Components/ThirdPersonCamera";
import UI from "./UI";

export default class Experience
{
    static instance

    constructor(_options = {})
    {
        if(Experience.instance)
        {
            return Experience.instance
        }
        Experience.instance = this

        // Options
        this.targetElement = _options.targetElement

        if(!this.targetElement)
        {
            console.warn('Missing \'targetElement\' property')
            return
        }

        this.time = new Time()
        this.sizes = new Sizes()
        this.isStarted = false;
        this.ui = new UI();
        this.startBtn = this.ui.startBtn
        this.character = null;
        this.setConfig()
        this.setDebug()
        this.setScrollManager()
        this.setStats()
        this.setMousePos()
        this.setScene()
        this.setCamera()
        this.setRenderer()
        this.setupAnimation();

        // this.setResources()
        // this.setFog()
        // this.setWorld()

        this.sizes.on('resize', () =>
        {
            this.resize()
        })

        this.update()
    }

    setConfig()
    {
        this.config = {}

        // Debug
        this.config.debug = window.location.hash === '#debug'

        // Pixel ratio
        this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

        // Width and height
        const boundings = this.targetElement.getBoundingClientRect()
        this.config.width = boundings.width
        this.config.height = boundings.height || window.innerHeight
    }

    setScrollManager()
    {
        this.scrollManager = new ScrollManager()
    }

    setDebug()
    {
        if(this.config.debug)
        {
            this.debug = new Pane({
                title: '⚙️ Debug',
            });
            this.debug.registerPlugin(EssentialsPlugin);
        }
    }

    setStats()
    {
        if(this.config.debug)
        {
            this.stats = new Stats(true)
        }
    }

    setMousePos()
    {
        this.mousePos = new MousePos();
    }

    setScene()
    {
        this.scene = new THREE.Scene()
    }

    setCamera()
    {
        this.camera = new Camera()
        this.thirdPersonCamera = new ThirdPersonCamera();
    }

    setupAnimation() {
        this.startBtn.addEventListener('click', () => {
            console.log('start')
            this.setAudio()
            this.setResources()
            this.setWorld()
            this.setFog()
            this.isStarted = true;
        });
    }

    setAudio()
    {
        this.audioListener = new THREE.AudioListener();
    }

    setRenderer()
    {
        this.renderer = new Renderer({ rendererInstance: this.rendererInstance })

        this.targetElement.appendChild(this.renderer.instance.domElement)
    }

    setResources()
    {
        this.resources = new Resources(assets)
    }

    setFog()
    {
        this.fog = new Fog()
    }

    setWorld()
    {
        this.world = new World()
    }

    update()
    {
        if(this.debug)
            this.debug.refresh(true);

        if(this.stats)
            this.stats.update()

        this.camera.update()

        if (this.character && this.camera.mode === 'follow') {
            this.thirdPersonCamera.update()
        }

        if(this.world)
            this.world.update()

        if(this.renderer)
            this.renderer.update()

        if(this.mousePos)
            this.mousePos.update()

        if (!this.isStarted && this.camera.grPlaneMaterial) {
            console.log(this.camera.instance.godRaysRotation)
            this.camera.grPlaneMaterial.uniforms.uCameraRotation.value.copy(this.camera.instance.godRaysRotation.set(
                this.camera.instance.godRaysRotation.x + this.time.delta * 0.0002,
                this.camera.instance.godRaysRotation.y + this.time.delta * 0.0002,
                this.camera.instance.godRaysRotation.z + this.time.delta * 0.0002,
            ));
        }

        window.requestAnimationFrame(() =>
        {
            this.update()
        })
    }

    resize()
    {
        // Config
        const boundings = this.targetElement.getBoundingClientRect()
        this.config.width = boundings.width
        this.config.height = boundings.height

        this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

        if(this.camera)
            this.camera.resize()

        if(this.renderer)
            this.renderer.resize()

        if(this.world)
            this.world.resize()

    }

    destroy()
    {

    }
}
