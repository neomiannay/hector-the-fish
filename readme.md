# Hector The Fish 🐟

## Setup
Run this followed commands:

``` bash
# Install dependencies (only the first time)
pnpm install

# Run the local server at localhost:5173
pnpm dev
```

## WebGL folder architecture

- `sources/`: Source code
  - `Experience/`: Main folder for the experience
    - `Components`: General components (ex: `Camera.js, Character.js, ...`)
    - `Scenes`: Scenes (ex: `MainScene.js, ...`)
    - `Objects`: Each object of the scene (ex: `Fish-lantern.js, ...`)
    - `Shaders`: Shaders (ex: `fish-lantern.frag, ...`)
    - `Utils`: Utils (ex: `EventEmitter.js, ...`)
    - 