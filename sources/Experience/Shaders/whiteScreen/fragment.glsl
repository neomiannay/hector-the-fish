uniform vec2 uResolution;
uniform float uTime;
uniform float uProgress;

varying vec2 vUv;

void main() {
    vec4 finalColor = vec4(1.0, 1.0, 1.0, 0.0);

    float fadeInStart = 0.94;
    if (uProgress > fadeInStart) {

        // increase the alpa from 0.0 to 1.0 very quickly
        float alpha = smoothstep(fadeInStart, 1.0, uProgress) * 5.0;
        
        finalColor.a = alpha;
    }
    
    gl_FragColor = finalColor;
}