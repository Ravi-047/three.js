uniform vec3 uColor;
uniform vec3 uAmbientColor;
uniform float uAmbientIntensity;

uniform vec3 uDirColor;
uniform float uDirIntensity;
uniform vec3 uDirPosition;
uniform float uDirSpecularPower;

uniform vec3 uPoint1Color;
uniform float uPoint1Intensity;
uniform vec3 uPoint1Position;
uniform float uPoint1SpecularPower;
uniform float uPoint1Decay;

uniform vec3 uPoint2Color;
uniform float uPoint2Intensity;
uniform vec3 uPoint2Position;
uniform float uPoint2SpecularPower;
uniform float uPoint2Decay;

varying vec3 vNormal;
varying vec3 vPosition;

#include '../includes/ambientLight.glsl'
#include '../includes/directionalLight.glsl'
#include '../includes/pointLight.glsl'

void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    vec3 color = uColor;

    // Light;
    vec3 light = vec3(0.0);
    light += ambientLight(vec3(uAmbientColor), uAmbientIntensity);
    light += directionalLight(vec3(uDirColor), uDirIntensity, normal, vec3(uDirPosition), viewDirection, uDirSpecularPower);
    light += pointLight(vec3(uPoint1Color), uPoint1Intensity, normal, vec3(uPoint1Position), viewDirection, uPoint1SpecularPower, vPosition, uPoint1Decay);
    light += pointLight(vec3(uPoint2Color), uPoint2Intensity, normal, vec3(uPoint2Position), viewDirection, uPoint2SpecularPower, vPosition, uPoint2Decay);
    color *= light;

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}