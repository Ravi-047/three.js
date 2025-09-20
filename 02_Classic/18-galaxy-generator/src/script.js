import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Galaxy

const parameters = {};
parameters.count = 5000;
parameters.size = 0.03;
parameters.radius = 5;
parameters.branches = 5;
parameters.spin = 1.5;
parameters.randomness = 0.2;
parameters.randomnessPower = 1.5;
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'
parameters.texture1 = new THREE.TextureLoader().load('/particles/1.png');
parameters.texture2 = new THREE.TextureLoader().load('/particles/2.png');
parameters.texture3 = new THREE.TextureLoader().load('/particles/3.png');
parameters.texture4 = new THREE.TextureLoader().load('/particles/4.png');
parameters.texture5 = new THREE.TextureLoader().load('/particles/5.png');
parameters.texture6 = new THREE.TextureLoader().load('/particles/6.png');
parameters.texture7 = new THREE.TextureLoader().load('/particles/7.png');
parameters.texture8 = new THREE.TextureLoader().load('/particles/8.png');
parameters.texture9 = new THREE.TextureLoader().load('/particles/9.png');
parameters.texture10 = new THREE.TextureLoader().load('/particles/10.png');
parameters.texture11 = new THREE.TextureLoader().load('/particles/11.png');
parameters.texture12 = new THREE.TextureLoader().load('/particles/12.png');
parameters.texture13 = new THREE.TextureLoader().load('/particles/13.png');
parameters.textureOptions = {
    'Texture 1': parameters.texture1,
    'Texture 2': parameters.texture2,
    'Texture 3': parameters.texture3,
    'Texture 4': parameters.texture4,
    'Texture 5': parameters.texture5,
    'Texture 6': parameters.texture6,
    'Texture 7': parameters.texture7,
    'Texture 8': parameters.texture8,
    'Texture 9': parameters.texture9,
    'Texture 10': parameters.texture10,
    'Texture 11': parameters.texture11,
    'Texture 12': parameters.texture12,
    'Texture 13': parameters.texture13,
};
parameters.selectedTexture = 'Texture 9';

let geometry = null;
let material = null;
let points = null;


const generateGalaxy = () => {
    // Destroy old galaxy
    if (points !== null) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
    }

    // Geometry
    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);
    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);


    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        // Position
        const radius = Math.random() * parameters.radius;
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;
        const spinAngle = radius * parameters.spin;

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;


        positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // Color
        const mixColor = colorInside.clone();
        mixColor.lerp(colorOutside, radius / parameters.radius);

        colors[i3 + 0] = mixColor.r;
        colors[i3 + 1] = mixColor.g;
        colors[i3 + 2] = mixColor.b;

    };
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material
    material = new THREE.PointsMaterial({
        alphaMap: parameters.textureOptions[parameters.selectedTexture],
        transparent: true,
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    });

    // Points
    points = new THREE.Points(geometry, material);
    scene.add(points);
}

generateGalaxy()
gui.add(parameters, 'count').min(100).max(10000).step(100).onFinishChange(generateGalaxy);
gui.add(parameters, 'size').min(0.01).max(0.5).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy);
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)
gui.add(parameters, 'selectedTexture', Object.keys(parameters.textureOptions))
    .name('Particle Texture')
    .onChange(generateGalaxy);


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    //Animation
    points.rotation.y = elapsedTime * 0.1

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()