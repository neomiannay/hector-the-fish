export default [
    {
        name: 'base',
        data: {},
        items:
        [
            { name: 'fish', source: '/assets/models/fish.glb', type: 'gltf' },
            { name: 'boat', source: '/assets/models/boat.glb', type: 'gltf' },
            { name: 'boatCurve', source: '/assets/models/boatCurve.glb', type: 'gltf' },
            { name: 'algue', source: '/assets/models/bakeAlgue.glb', type: 'gltf' },
            { name: 'sandNormal', source: '/assets/textures/sand-normal.jpg', type: 'texture' },
            { name: 'sandDiffuse', source: '/assets/textures/sand-diffuse.jpg', type: 'texture' },
            { name: 'sandAmbientOcclusion', source: '/assets/textures/sand-ambientOcclusion.jpg', type: 'texture' },

            // Sounds
            {name: 'fishTalking', source: '/assets/sounds/fish-talking.mp3', type: 'audio'},
            {name: 'mainMusic', source: '/assets/sounds/main-music.mp3', type: 'audio'},
            {name: 'deepTheme', source: '/assets/sounds/deep-ocean.mp3', type: 'audio'},
            {name: 'fearSound', source: '/assets/sounds/fear-sound.wav', type: 'audio'},
            {name: 'plantSound', source: '/assets/sounds/moving-plants.wav', type: 'audio'},
            {name: 'boatGrincement', source: '/assets/sounds/bateau.wav', type: 'audio'},
            {name: 'discoverCoquillage', source: '/assets/sounds/discover-coquillage.mp3', type: 'audio'},
            {name: 'bruitEffrayant', source: '/assets/sounds/bruit-effrayant.mp3', type: 'audio'},
        ]
    }
]