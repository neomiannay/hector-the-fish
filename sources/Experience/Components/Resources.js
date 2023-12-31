import * as THREE from 'three'
import EventEmitter from '../Utils/EventEmitter.js'
import Loader from '../Utils/Loader.js'
import Experience from "../Experience";

export default class Resources extends EventEmitter
{
    constructor(_assets)
    {
        super()

        this.experience = new Experience()
        this.audioListener = this.experience.audioListener;

        // Items (will contain every resources)
        this.items = {}

        // Loader
        this.loader = new Loader({ renderer: this.renderer })

        console.log('loading: ', _assets)
        console.log('this loader: ', this.loader)

        this.groups = {}
        this.groups.assets = [..._assets]
        this.groups.loaded = []
        this.groups.current = null
        this.loadNextGroup()

        // Loader file end event
        this.loader.on('fileEnd', (_resource, _data) =>
        {
            let data = _data

            // Convert to texture
            if(_resource.type === 'texture')
            {
                if(!(data instanceof THREE.Texture))
                {
                    data = new THREE.Texture(_data)
                }
                data.needsUpdate = true
            } else if (_resource.type === 'audio') {
                if(!(data instanceof THREE.Audio)) {
                    console.log('loading: ', _resource)
                    const sound = new THREE.PositionalAudio(this.audioListener);
                    sound.setBuffer(_data);
                    sound.setRefDistance(100)
                    sound.setVolume(1.0)
                    data = sound;
                }
            }

            this.items[_resource.name] = data

            // Progress and event
            this.groups.current.loaded++
            this.trigger('progress', [this.groups.current, _resource, data])
        })

        // Loader all end event
        this.loader.on('end', () =>
        {
            this.groups.loaded.push(this.groups.current)
            
            // Trigger
            this.trigger('groupEnd', [this.groups.current])

            if(this.groups.assets.length > 0)
            {
                this.loadNextGroup()
            }
            else
            {
                this.trigger('end')
            }
        })
    }

    loadNextGroup()
    {
        this.groups.current = this.groups.assets.shift()
        this.groups.current.toLoad = this.groups.current.items.length
        this.groups.current.loaded = 0

        this.loader.load(this.groups.current.items)
    }

    createInstancedMeshes(_children, _groups)
    {
        // Groups
        const groups = []

        for(const _group of _groups)
        {
            groups.push({
                name: _group.name,
                regex: _group.regex,
                meshesGroups: [],
                instancedMeshes: []
            })
        }

        // Result
        const result = {}

        for(const _group of groups)
        {
            result[_group.name] = _group.instancedMeshes
        }

        return result
    }

    destroy()
    {
        for(const _itemKey in this.items)
        {
            const item = this.items[_itemKey]
            if(item instanceof THREE.Texture)
            {
                item.dispose()
            }
        }
    }
}
