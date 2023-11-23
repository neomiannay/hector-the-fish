import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Fog {
    constructor(_options) {
        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.renderer = this.experience.renderer

        this.fogColor = 0x072739;
        this.near = 7.6;
        this.far = 40.2;
        this.density = 0.1;

        this.modes = 'debug'
        
        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.setFog()
                this.setModes()

                if (this.debug) {
                    this.debugFolder()
                }
            }
        })
    }

    setModes()
    {
        this.modes = {}

        // Default
        this.modes.default = {}
        this.modes.default.instance = this.instance.clone()

        // Debug
        this.modes.debug = {}
        this.modes.debug.instance = this.instance.clone()

    }


    debugFolder() {
        /**
         * @param {Debug} PARAMS
         */
        this.PARAMS = {
            fogColor: this.fogColor,
            near: this.near,
            far: this.far,
            isActive: true,
        }

        // refer to the scene folder
        this.debugFolder = this.debug.addFolder({
            title: 'fog',
            expanded: true,
        })

        this.debugFolder
            .addBinding(this.PARAMS, 'fogColor', {
                view: 'color',
            })
            .on('change', () => {
                this.scene.fog.color.setHex(this.PARAMS.fogColor);
                this.renderer.instance.setClearColor(this.PARAMS.fogColor, 1)
            })

        this.debugFolder
            .addBinding(this.PARAMS, 'near', {min: 0, max: 100, step: 0.1})
            .on('change', () => {
                this.scene.fog.near = this.PARAMS.near;
            })

        this.debugFolder
            .addBinding(this.PARAMS, 'far', {min: 0, max: 100, step: 0.1})
            .on('change', () => {
                this.scene.fog.far = this.PARAMS.far;
            })


        this.debugFolder
            .addBinding(this.PARAMS, 'isActive')
            .on('change', ({value}) => {
                if (value) {
                    this.scene.fog.near = this.near;
                    this.scene.fog.far = this.far;
                } else {
                    this.scene.fog.near = 1.0;
                    this.scene.fog.far = 0;
                }
            });

    }

    setFog() {
        this.instance = new THREE.Fog(this.fogColor, this.near, this.far)
        this.scene.fog = this.instance;

        // this.scene.fog.color.setHex(this.fogColor);
        // this.scene.fog.near = this.near;
        // this.scene.fog.far = this.far;

        // this.scene.background = new THREE.Color(this.fogColor);
    }
}