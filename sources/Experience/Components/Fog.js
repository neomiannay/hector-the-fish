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

        this.fogColor = 0x0090E2;
        this.near = 0;
        this.far = 10;
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


    debugFolder()
    {
        /**
         * @param {Debug} PARAMS
        */
        this.PARAMS = {
            fogColor: this.fogColor,
            near: this.near,
            far: this.far,
            density: this.density,
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

        // this.debugFolder
        //     .addBinding( this.PARAMS, 'near', {
        //         min: 0, max: 10, step: 0.1
        //     })
        //     .on('change', () => {
        //         this.scene.fog.near = this.PARAMS.near;
        //     })

        // this.debugFolder
        //     .addBinding( this.PARAMS, 'far', {
        //         min: 0, max: 10, step: 0.1
        //     })
        //     .on('change', () => {
        //         this.scene.fog.far = this.PARAMS.far;
        //     })

        this.debugFolder
            .addBinding( this.PARAMS, 'density', {
                min: 0, max: .5, step: 0.001
            })
            .on('change', () => {
                this.instance.density = this.PARAMS.density;
            })
    }

    setFog() {
        this.instance = new THREE.FogExp2( this.fogColor, this.density );
        this.scene.fog = this.instance;

        // this.scene.fog.color.setHex(this.fogColor);
        // this.scene.fog.near = this.near;
        // this.scene.fog.far = this.far;

        // this.scene.background = new THREE.Color(this.fogColor);
    }
}