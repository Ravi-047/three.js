import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import holographicVertexShader from './shaders/holographic/holographicVertex.glsl';
import holographicFragmentShader from './shaders/holographic/holographicFragment.glsl';


/**
 * Base
 */
// Debug
const gui = new GUI()
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const gltfLoader = new GLTFLoader()

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
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.set(7, 7, 7)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const rendererParameters = {}
rendererParameters.clearColor = '#1d1f2a'

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setClearColor(rendererParameters.clearColor)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

gui
    .addColor(rendererParameters, 'clearColor')
    .onChange(() => {
        renderer.setClearColor(rendererParameters.clearColor)
    })

/**
 * Material
 */
// Shader params
debugObject.color = '#00ffff'
debugObject.glitchStrength = 0.25
debugObject.stripeDensity = 20.0
debugObject.stripeSpeed = 0.05
debugObject.stripePower = 3.0
debugObject.fresnelPower = 2.0
debugObject.fresnelBoost = 1.25
debugObject.falloffStart = 0.8
debugObject.falloffEnd = 0.0

// Rotation
debugObject.rotationSpeedX = 0.1
debugObject.rotationSpeedY = 0.2

// Toggles
debugObject.showSphere = true
debugObject.showTorus = true
debugObject.showSuzanne = true
debugObject.wireframe = false
debugObject.blendingMode = 'Additive'

const material = new THREE.ShaderMaterial({
    vertexShader: holographicVertexShader,
    fragmentShader: holographicFragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
        uTime: new THREE.Uniform(0),
        uColor: new THREE.Uniform(new THREE.Color(debugObject.color)),
        uGlitchStrength: new THREE.Uniform(debugObject.glitchStrength),
        uStripeDensity: new THREE.Uniform(debugObject.stripeDensity),
        uStripeSpeed: new THREE.Uniform(debugObject.stripeSpeed),
        uStripePower: new THREE.Uniform(debugObject.stripePower),
        uFresnelPower: new THREE.Uniform(debugObject.fresnelPower),
        uFresnelBoost: new THREE.Uniform(debugObject.fresnelBoost),
        uFalloffStart: new THREE.Uniform(debugObject.falloffStart),
        uFalloffEnd: new THREE.Uniform(debugObject.falloffEnd),
    }
})

gui.addColor(debugObject, 'color').onChange(() => {
    material.uniforms.uColor.value.set(debugObject.color)
})

// Shader params
gui.add(debugObject, 'glitchStrength', 0.0, 1.0, 0.01).onChange(() => {
    material.uniforms.uGlitchStrength.value = debugObject.glitchStrength
})
gui.add(debugObject, 'stripeDensity', 1.0, 50.0, 1.0).onChange(() => {
    material.uniforms.uStripeDensity.value = debugObject.stripeDensity
})
gui.add(debugObject, 'stripeSpeed', 0.0, 0.2, 0.001).onChange(() => {
    material.uniforms.uStripeSpeed.value = debugObject.stripeSpeed
})
gui.add(debugObject, 'stripePower', 1.0, 6.0, 0.1).onChange(() => {
    material.uniforms.uStripePower.value = debugObject.stripePower
})
gui.add(debugObject, 'fresnelPower', 0.1, 5.0, 0.1).onChange(() => {
    material.uniforms.uFresnelPower.value = debugObject.fresnelPower
})
gui.add(debugObject, 'fresnelBoost', 0.0, 2.0, 0.05).onChange(() => {
    material.uniforms.uFresnelBoost.value = debugObject.fresnelBoost
})
gui.add(debugObject, 'falloffStart', 0.0, 1.0, 0.01).onChange(() => {
    material.uniforms.uFalloffStart.value = debugObject.falloffStart
})
gui.add(debugObject, 'falloffEnd', -1.0, 1.0, 0.01).onChange(() => {
    material.uniforms.uFalloffEnd.value = debugObject.falloffEnd
})

// Rotation
gui.add(debugObject, 'rotationSpeedX', -1.0, 1.0, 0.01)
gui.add(debugObject, 'rotationSpeedY', -1.0, 1.0, 0.01)

// Visibility
gui.add(debugObject, 'showSphere').onChange(v => sphere.visible = v)
gui.add(debugObject, 'showTorus').onChange(v => torusKnot.visible = v)
gui.add(debugObject, 'showSuzanne').onChange(v => { if (suzanne) suzanne.visible = v })

// Material tweaks
gui.add(debugObject, 'wireframe').onChange(v => material.wireframe = v)
gui.add(debugObject, 'blendingMode', ['Additive', 'Normal', 'Multiply']).onChange(mode => {
    if (mode === 'Additive') material.blending = THREE.AdditiveBlending
    if (mode === 'Normal') material.blending = THREE.NormalBlending
    if (mode === 'Multiply') material.blending = THREE.MultiplyBlending
})

/**
 * Objects
 */
// Torus knot
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),
    material
)
torusKnot.position.x = 3
scene.add(torusKnot)

// Sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(),
    material
)
sphere.position.x = - 3
scene.add(sphere)

// Suzanne
let suzanne = null
gltfLoader.load(
    './suzanne.glb',
    (gltf) => {
        suzanne = gltf.scene
        suzanne.traverse((child) => {
            if (child.isMesh)
                child.material = material
        })
        scene.add(suzanne)
    }
)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update material
    material.uniforms.uTime.value = elapsedTime;

    // Rotate objects
    if (suzanne) {
        suzanne.rotation.x = - elapsedTime * 0.1
        suzanne.rotation.y = elapsedTime * 0.2
    }

    sphere.rotation.x = - elapsedTime * 0.1
    sphere.rotation.y = elapsedTime * 0.2

    torusKnot.rotation.x = - elapsedTime * 0.1
    torusKnot.rotation.y = elapsedTime * 0.2

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()