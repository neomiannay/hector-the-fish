export default [
    {
        name: 'base',
        data: {},
        items:
        [
            { name: 'fish', source: '/assets/models/koi-fish4.glb', type: 'gltf' },
            { name: 'finalFish', source: '/assets/models/final_fish.glb', type: 'gltf' },
            { name: 'finalFishV2', source: '/assets/models/fishAnimV3.glb', type: 'gltf' },
            { name: 'boatAnim', source: '/assets/models/boat4.glb', type: 'gltf' },
            { name: 'sandNormal', source: '/assets/textures/sand-normal.jpg', type: 'texture' },
            { name: 'sandDiffuse', source: '/assets/textures/sand-diffuse.jpg', type: 'texture' },
            { name: 'sandAmbientOcclusion', source: '/assets/textures/sand-ambientOcclusion.jpg', type: 'texture' },

            // Sounds
            {name: 'mainMusic', source: '/assets/sounds/ambient.mp3', type: 'audio'},
            // {name: 'ambientSound', source: '/assets/sounds/ambient.mp3', type: 'audio'},

        ]
    }
]