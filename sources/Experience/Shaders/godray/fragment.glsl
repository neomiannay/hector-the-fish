uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uCameraRotation;

varying vec2 vUv;

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed)
{
    vec2 sourceToCoord = coord - raySource;
    float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
    
    return clamp(
        (0.45 + 0.15 * sin(cosAngle * seedA + uTime * speed)) +
        (0.3 + 0.2 * cos(-cosAngle * seedB + uTime * speed)),
        0.0, 1.0) *
        clamp((uResolution.x - length(sourceToCoord)) / uResolution.x, 0.5, 1.0);
}

const vec3 godrayColor = vec3(1.0, 191.0 / 255.0, 255.0 / 255.0);

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 coord = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
    
    vec2 rayPos1 = vec2(uResolution.x * 0.8, uResolution.y * -5.);
    vec2 rayRefDir1 = normalize(vec2(1.0, 0.241));
    const float raySeedA1 = 22.39910;
    const float raySeedB1 = 18.0234;
    const float raySpeed1 = 1.1;

    vec2 rayPos2 = vec2(uResolution.x * 0.8, uResolution.y * -5.);
    vec2 rayRefDir2 = normalize(vec2(1.6, -0.116));
    float raySeedA2 = 36.2214;
    float raySeedB2 = 21.11349;
    float raySpeed2 = 1.5;


    float rotationAngle = uCameraRotation.y;
    vec2 rotatedDir = vec2(cos(rotationAngle), sin(rotationAngle));
    
    vec2 rotatedRayPos1 = rayPos1 + rotatedDir * 100.0;
    vec2 rotatedRayPos2 = rayPos2 + rotatedDir * 100.0;

    // Calculate the colour of the sun rays on the current fragment with the modified positions
    vec4 rays1 =
        vec4(godrayColor, 1.0) *
        rayStrength(rotatedRayPos1, rotatedDir, coord, raySeedA1, raySeedB1, raySpeed1);

    vec4 rays2 =
        vec4(godrayColor, 1.0) *
        rayStrength(rotatedRayPos2, rotatedDir, coord, raySeedA2, raySeedB2, raySpeed2);

    vec4 fragColor = rays1 * .5 + rays2 * .4;

    // Attenuate brightness towards the bottom, simulating light-loss due to depth.
    // Give the whole thing a blue-green tinge as well.
    float brightness = 1.0 - (coord.y / uResolution.y);
    fragColor.rgb *= vec3(
        0.004,
        0.749,
        1.
        ) * brightness;

    gl_FragColor = vec4(fragColor.rgb, 0.4);
}