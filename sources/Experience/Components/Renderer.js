import * as THREE from 'three'
import Experience from '../Experience.js'
import { BlendFunction, DepthOfFieldEffect, DepthEffect, VignetteEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";

export default class Renderer
{
    constructor(_options = {})
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.stats = this.experience.stats
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera

        this.usePostprocess = true

        this.setInstance()
        this.setPostProcess()

        // Debug
        if(this.debug)
        {
            this.setDebug()
        }

    }

    setInstance()
    {
        this.clearColor = '#0090E2'

        // Renderer
        this.instance = new THREE.WebGLRenderer({
            // alpha: false,
            antialias: true,
            depth: false
        })
        this.instance.domElement.style.position = 'absolute'
        this.instance.domElement.style.top = 0
        this.instance.domElement.style.left = 0
        this.instance.domElement.style.width = '100%'
        this.instance.domElement.style.height = '100%'

        this.instance.setClearColor(this.clearColor, 1)
        this.instance.setSize(this.config.width, this.config.height)
        this.instance.setPixelRatio(this.config.pixelRatio)

        this.instance.physicallyCorrectLights = false
        this.instance.outputColorSpace = THREE.SRGBColorSpace
        this.instance.toneMapping = THREE.ACESFilmicToneMapping
        this.instance.toneMappingExposure = 1

        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap

        this.context = this.instance.getContext()

        // Add stats panel
        if(this.stats)
        {
            this.stats.setRenderPanel(this.context)
        }
    }

    setPostProcess()
    {
        this.postProcess = {}

        /**
         * Render pass
         */
        this.postProcess.renderPass = new RenderPass(this.scene, this.camera.instance)

        /**
         * Effect composer
         */
        this.postProcess.composer = new EffectComposer(this.instance)
        this.postProcess.composer.setSize(this.config.width, this.config.height)
        // this.postProcess.composer.setPixelRatio(this.config.pixelRatio)

        this.depthOfFieldEffect = new DepthOfFieldEffect(this.camera.instance, {
			bokehScale: 2.0,
            resolutionScale: 0.25,
		});

        this.depthEffect = new DepthEffect({
            blendFunction: BlendFunction.SKIP
        });

        this.vignetteEffect = new VignetteEffect({
			eskil: false,
			offset: 0.35,
			darkness: 0.5
		});

        this.effectPass = new EffectPass(
            this.camera.instance,
        this.depthOfFieldEffect,
        // this.depthEffect,
        this.vignetteEffect
        );

        this.cocMaterial = this.depthOfFieldEffect.cocMaterial;

        this.postProcess.composer.addPass(this.postProcess.renderPass)
        this.postProcess.composer.addPass(this.effectPass)

    }

    setDebug()
    {
        /**
         * @param {Debug} PARAMS
        */
        this.PARAMS = {
            depthOfField: {
                height: 480,
                bokehScale: 2.0,
            },
            vignette: {
                enabled: true,
                offset: 0.35,
                darkness: 0.5
            },
        }

        // Depth of field
        this.DOFFolder = this.debug.addFolder({
            title: 'Depth of field',
            expanded: true,
        })
        this.VignetteFolder = this.debug.addFolder({
            title: 'Vignette',
            expanded: true,
        })

        this.DOFFolder
            .addBinding(this.PARAMS.depthOfField, 'height', {
                options: { 240: 240, 360: 360, 480: 480, 720: 720, 1080: 1080 }
            })
            .on('change', ({value}) => {
                this.depthOfFieldEffect.resolution.height = Number(value);
            })
        this.DOFFolder
            .addBinding(this.PARAMS.depthOfField, 'bokehScale', {
                min: 1, max: 5, step: 0.1
            })
            .on('change', ({value}) => {
                this.depthOfFieldEffect.bokehScale = value;
            })

        // Vignette
        this.VignetteFolder
            .addBinding(this.PARAMS.vignette, 'enabled')
            .on('change', ({value}) => {
                this.vignetteEffect.enabled = value;
            })
        this.VignetteFolder
            .addBinding(this.PARAMS.vignette, 'offset', {
                min: 0, max: 1, step: 0.001
            })
            .on('change', ({value}) => {
                this.vignetteEffect.uniforms.get('offset').value = value;
            })
        this.VignetteFolder
            .addBinding(this.PARAMS.vignette, 'darkness', {
                min: 0, max: 1, step: 0.001
            })
            .on('change', ({value}) => {
                this.vignetteEffect.uniforms.get('darkness').value = value;
            })

    }

    resize()
    {
        // Instance
        this.instance.setSize(this.config.width, this.config.height)
        this.instance.setPixelRatio(this.config.pixelRatio)

        // Post process
        this.postProcess.composer.setSize(this.config.width, this.config.height)
        this.postProcess.composer.setPixelRatio(this.config.pixelRatio)
    }

    update()
    {
        if(this.stats)
        {
            this.stats.beforeRender()
        }

        if(this.usePostprocess)
        {
            this.postProcess.composer.render()
        }
        else
        {
            this.instance.render(this.scene, this.camera.instance)
        }

        if(this.stats)
        {
            this.stats.afterRender()
        }
    }

    destroy()
    {
        this.instance.renderLists.dispose()
        this.instance.dispose()
        this.renderTarget.dispose()
        this.postProcess.composer.renderTarget1.dispose()
        this.postProcess.composer.renderTarget2.dispose()
    }
}
