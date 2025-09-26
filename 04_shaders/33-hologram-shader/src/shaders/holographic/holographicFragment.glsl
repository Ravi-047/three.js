uniform float uTime;
uniform vec3 uColor;
uniform float uStripeDensity;
uniform float uStripeSpeed;
uniform float uStripePower;
uniform float uFresnelPower;
uniform float uFresnelBoost;
uniform float uFalloffStart;
uniform float uFalloffEnd;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    //normal
    vec3 normal = normalize(vNormal);
    if(!gl_FrontFacing) {
        normal *= -1.0;
    }

    // stripes
    float stripes = mod((vPosition.y - uTime * uStripeSpeed) * uStripeDensity, 1.0);
    stripes = pow(stripes, uStripePower);

    // Fresnel effect
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, uFresnelPower);

    // fall off
    float fallOff = smoothstep(uFalloffStart, uFalloffEnd, fresnel);

    // holographic effect
    float holographic = stripes * fresnel;
    holographic += fresnel * uFresnelBoost;
    holographic *= fallOff;

    // final color
    gl_FragColor = vec4(uColor, holographic);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}