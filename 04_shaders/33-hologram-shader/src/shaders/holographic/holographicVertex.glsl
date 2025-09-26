varying vec3 vPosition;
varying vec3 vNormal;
uniform float uTime;
uniform float uGlitchStrength;

#include ../includes/random2D.glsl

void main() {
    // model position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // glitch effect
    float glitchTime = uTime - modelPosition.y;
    float glitchStrength = sin(glitchTime) + cos(glitchTime * 3.45) + sin(glitchTime * 8.76);
    glitchStrength = smoothstep(0.3, 1.0, glitchStrength);
    glitchStrength *= uGlitchStrength;
    modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength;
    modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * glitchStrength;

    // view position
    vec4 viewPosition = viewMatrix * modelPosition;

    // projection position
    vec4 projectionPosition = projectionMatrix * viewPosition;

    // final position
    gl_Position = projectionPosition;

    // model normal
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    // varyings
    vPosition = modelPosition.xyz;
    vNormal = modelNormal.xyz;
}