import { MeshBasicMaterial, Vector2, Vector3 } from 'three';

export default class Caustics extends MeshBasicMaterial {
    /** 
     * @param {import('three').MeshBasicMaterial} params
    */
    constructor(params) {
        super({
            ...params
        })
    }


    /** 
     * @param {import('three').Shader} shader
     * @param {import('three').WebGLRenderer} renderer
    */
    onBeforeCompile(shader, renderer) {
        super.onBeforeCompile(shader, renderer);

        shader.uniforms.uTime = { value: 0 };
        shader.uniforms.uResolution = { value: new Vector2() };

        /**
         * VERTEX
         */
        shader.vertexShader = shader.vertexShader.replace(
            'void main() {',
            `
            varying vec2 vUv;
            void main() {
            vUv = uv;
        `);

        /**
         * FRAGMENT
         */
        shader.fragmentShader = shader.fragmentShader.replace(
            'void main() {',
            `
            uniform float uTime;
            uniform vec2 uResolution;
            varying vec2 vUv;

            #define TAU 6.28318530718
            #define MAX_ITER 5
            void main() {
        `);
        
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <map_fragment>', // avant que le shader shunck prjette le spositions transofrmées depuis l'objet dans le world
            `
            #include <map_fragment>
                float time = uTime * .5+23.0;
                vec2 uv = vUv * vec2(uResolution.x / uResolution.y, 1.);
            #ifdef SHOW_TILING
                vec2 p = mod(uv*TAU*2.0, TAU)-250.0;
            #else
                vec2 p = mod(uv*TAU, TAU)-250.0;
            #endif
                vec2 i = vec2(p);
                float c = 1.0;
                float inten = .005;

                for (int n = 0; n < MAX_ITER; n++) 
                {
                    float t = time * (1.0 - (3.5 / float(n+1)));
                    i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
                    c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
                }
                c /= float(MAX_ITER);
                c = 1.17-pow(c, 1.4);
                vec3 colour = vec3(pow(abs(c), 8.0));
                colour = clamp(colour + vec3(0.,0.565,0.886), 0.0, 1.0);

                #ifdef SHOW_TILING
                // Flash tile borders...
                vec2 pixel = 10.0 / uResolution.xy;
                uv *= 2.0;

                float f = floor(mod(uTime*.5, 2.0)); 	// Flash value.
                vec2 first = step(pixel, uv) * f;		   	// Rule out first screen pixels and flash.
                uv  = step(fract(uv), pixel);				// Add one line of pixels per tile.
                colour = (uv.x + uv.y) * first.x * first.y;
                #endif
            
                diffuseColor.rgb = colour;
        `);

        this.userData.shader = shader;
    }

    update(time, width, height) {
        if (this.userData && this.userData.shader) {
            this.userData.shader.uniforms.uTime.value = time;
            this.userData.shader.uniforms.uResolution.value.set(width, height);
        }
    }

}