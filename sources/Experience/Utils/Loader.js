import EventEmitter from './EventEmitter.js'
import Experience from '../Experience.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import {AudioLoader} from "three";

export default class Resources extends EventEmitter
{
    /**
     * Constructor
     */
    constructor()
    {
        super()

        this.experience = new Experience()
        this.renderer = this.experience.renderer.instance

        this.toLoad = 0
        this.loaded = 0
        this.items = {}

        this.loadingScreenElement = null;
        this.loadingBarElement = null;
        this.setLoadingScreen();

        this.setLoaders()
    }

    setLoadingScreen() {
        this.loadingScreenElement = this.experience.ui.loadingScreenElement;
        this.loadingBarElement = this.experience.ui.loadingBarElement;
	}

    /**
     * Set loaders
     */
    setLoaders()
    {
        this.loaders = []

        // Images
        this.loaders.push({
            extensions: ['jpg', 'png'],
            action: (_resource) =>
            {
                const image = new Image()

                image.addEventListener('load', () =>
                {
                    this.fileLoadEnd(_resource, image)
                })

                image.addEventListener('error', () =>
                {
                    this.fileLoadEnd(_resource, image)
                })

                image.src = _resource.source
            }
        })

        // Draco
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('draco/')
        dracoLoader.setDecoderConfig({ type: 'js' })

        this.loaders.push({
            extensions: ['drc'],
            action: (_resource) =>
            {
                dracoLoader.load(_resource.source, (_data) =>
                {
                    this.fileLoadEnd(_resource, _data)

                    DRACOLoader.releaseDecoderModule()
                })
            }
        })

        // GLTF
        const gltfLoader = new GLTFLoader()
        gltfLoader.setDRACOLoader(dracoLoader)

        this.loaders.push({
            extensions: ['glb', 'gltf'],
            action: (_resource) =>
            {
                gltfLoader.load(_resource.source, (_data) =>
                {
                    this.fileLoadEnd(_resource, _data)
                })
            }
        })

        // FBX
        const fbxLoader = new FBXLoader()

        this.loaders.push({
            extensions: ['fbx'],
            action: (_resource) =>
            {
                fbxLoader.load(_resource.source, (_data) =>
                {
                    this.fileLoadEnd(_resource, _data)
                })
            }
        })

        // RGBE | HDR
        const rgbeLoader = new RGBELoader()

        this.loaders.push({
            extensions: ['hdr'],
            action: (_resource) =>
            {
                rgbeLoader.load(_resource.source, (_data) =>
                {
                    this.fileLoadEnd(_resource, _data)
                })
            }
        })

        // Audio
        const audioLoader = new AudioLoader();
        this.loaders.push({
            extensions: ['mp3', 'ogg', 'wav'],
            action: (_resource) =>
            {
                audioLoader.load(_resource.source, (_data) =>
                {
                    this.fileLoadEnd(_resource, _data)
                })
            }
        })
    }

    /**
     * Load
     */
    load(_resources = [])
    {
        for(const _resource of _resources)
        {
            this.toLoad++
            // old regex: /\.([a-z]+)$/
            const extensionMatch = _resource.source.match(/\.([a-z0-9]+)$/i)

            if(typeof extensionMatch[1] !== 'undefined')
            {
                const extension = extensionMatch[1]
                const loader = this.loaders.find((_loader) => _loader.extensions.find((_extension) => _extension === extension))

                if(loader && this.loadingBarElement)
                {
                    loader.action(_resource)
                    const progress = this.loaded / this.toLoad;
                    this.loadingBarElement.style.transform = `scaleX(${progress})`;
                }
                else
                {
                    console.warn(`Cannot found loader for ${_resource}`)
                }
            }
            else
            {
                console.warn(`Cannot found extension of ${_resource}`)
            }
        }
    }

    /**
     * File load end
     */
    fileLoadEnd(_resource, _data)
    {
        this.loaded++
        this.items[_resource.name] = _data

        this.trigger('fileEnd', [_resource, _data])

        if (this.loadingBarElement) {
            const progress = this.loaded / this.toLoad;
            this.loadingBarElement.style.transform = `scaleX(${progress})`;
        }

        // Check if all resources are loaded
        if (this.loaded === this.toLoad) {
            // All resources are loaded, remove loading screen
            if (this.loadingScreenElement) {
                console.log('removing')
                this.experience.ui.mainScreen.classList.add('hidden');
                this.loadingScreenElement.remove();
                this.loadingScreenElement = null;
                this.loadingBarElement = null;

                setTimeout(() => {
                    this.experience.ui.mainScreen.style.display = 'none';
                }, 500)
            }
            this.trigger('end'); // Signal that all resources are loaded
        }
    }
}
