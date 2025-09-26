uniform float uTime;
uniform sampler2D uPerlinTexture;

varying vec2 vUv;

#include ../shaders/includes/rotate2D.glsl

void main() {
    vec3 newPosition = position;
    //twist
    float twistPerlin = texture2D(uPerlinTexture, vec2(0.5, uv.y * 0.2 - uTime * 0.009)).r;
    float angle = twistPerlin * 5.0;
    vec2 rotatedPosition = rotate2D(newPosition.xz, angle);
    newPosition.xz = rotatedPosition;

    // wind
    vec2 windOffset = vec2(texture(uPerlinTexture, vec2(0.25, uTime * 0.01)).r - 0.5, texture(uPerlinTexture, vec2(0.75, uTime * 0.01)).r - 0.5);
    windOffset *= pow(uv.y, 2.0) * 10.0;
    newPosition.xz += windOffset;

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // varying
    vUv = uv;
}