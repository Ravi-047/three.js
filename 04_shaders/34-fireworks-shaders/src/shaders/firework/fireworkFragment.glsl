uniform sampler2D uTexture;
uniform vec3 uColor;

void main() {
    // texture
    // vec4 textureColor = texture(uTexture, gl_PointCoord);
    float textureAlpha = texture(uTexture, gl_PointCoord).r;

    // main color
    // gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);
    gl_FragColor = vec4(uColor, textureAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}