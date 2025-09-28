import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import shadingVertexShader from './shaders/shading/vertex.glsl'
import shadingFragmentShader from './shaders/shading/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI()

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
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 7
camera.position.y = 7
camera.position.z = 7
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
// renderer.toneMapping = THREE.ACESFilmicToneMapping
// renderer.toneMappingExposure = 3
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

/**
 * Material + Parameters
 */
const materialParameters = {}
materialParameters.color = '#ffffff'
const ambientLightParams = { intensity: 0.03, color: '#ffffff' }
const directionalLightParams = {
    intensity: 1.0,
    color: '#1a1aff',
    x: 0.0,
    y: 0.0,
    z: 3.0,
    specularPower: 20.0
}
const pointLight1Params = {
    intensity: 1.0,
    color: '#ff1a1a',
    x: 0.0,
    y: 2.5,
    z: 0.0,
    specularPower: 20.0,
    decay: 0.25
}
const pointLight2Params = {
    intensity: 1.0,
    color: '#1aff80',
    x: 2.0,
    y: 2.0,
    z: 2.0,
    specularPower: 20.0,
    decay: 0.25
}
const rendererParams = {
    toneMapping: 'None',
    exposure: 1.0
}
const rotationParams = { speed: 0.2 }

const material = new THREE.ShaderMaterial({
    vertexShader: shadingVertexShader,
    fragmentShader: shadingFragmentShader,
    uniforms:
    {
        uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
        // Ambient
        uAmbientColor: new THREE.Uniform(new THREE.Color(ambientLightParams.color)),
        uAmbientIntensity: new THREE.Uniform(ambientLightParams.intensity),
        // Directional
        uDirColor: new THREE.Uniform(new THREE.Color(directionalLightParams.color)),
        uDirIntensity: new THREE.Uniform(directionalLightParams.intensity),
        uDirPosition: new THREE.Uniform(new THREE.Vector3(directionalLightParams.x, directionalLightParams.y, directionalLightParams.z)),
        uDirSpecularPower: new THREE.Uniform(directionalLightParams.specularPower),
        // Point Light 1
        uPoint1Color: new THREE.Uniform(new THREE.Color(pointLight1Params.color)),
        uPoint1Intensity: new THREE.Uniform(pointLight1Params.intensity),
        uPoint1Position: new THREE.Uniform(new THREE.Vector3(pointLight1Params.x, pointLight1Params.y, pointLight1Params.z)),
        uPoint1SpecularPower: new THREE.Uniform(pointLight1Params.specularPower),
        uPoint1Decay: new THREE.Uniform(pointLight1Params.decay),
        // Point Light 2
        uPoint2Color: new THREE.Uniform(new THREE.Color(pointLight2Params.color)),
        uPoint2Intensity: new THREE.Uniform(pointLight2Params.intensity),
        uPoint2Position: new THREE.Uniform(new THREE.Vector3(pointLight2Params.x, pointLight2Params.y, pointLight2Params.z)),
        uPoint2SpecularPower: new THREE.Uniform(pointLight2Params.specularPower),
        uPoint2Decay: new THREE.Uniform(pointLight2Params.decay),
    }
})

// gui
//     .addColor(materialParameters, 'color')
//     .onChange(() => {
//         material.uniforms.uColor.value.set(materialParameters.color)
//     })

const ambientFolder = gui.addFolder('Ambient Light')
ambientFolder.close()
ambientFolder.add(ambientLightParams, 'intensity', 0, 1, 0.01).onChange(v => material.uniforms.uAmbientIntensity.value = v)
ambientFolder.addColor(ambientLightParams, 'color').onChange(v => material.uniforms.uAmbientColor.value.set(v))

// Directional
const dirFolder = gui.addFolder('Directional Light')
dirFolder.close()
dirFolder.addColor(directionalLightParams, 'color').onChange(v => {
    material.uniforms.uDirColor.value.set(v);
    directionalLightHelper.material.color.set(v)
})
dirFolder.add(directionalLightParams, 'intensity', 0, 5, 0.01).onChange(v => {
    material.uniforms.uDirIntensity.value = v;
})
dirFolder.add(directionalLightParams, 'x', -5, 5, 0.01).onChange(v => {
    material.uniforms.uDirPosition.value.x = v;
    directionalLightHelper.position.x = v
})
dirFolder.add(directionalLightParams, 'y', -5, 5, 0.01).onChange(v => {
    material.uniforms.uDirPosition.value.y = v;
    directionalLightHelper.position.y = v;
})
dirFolder.add(directionalLightParams, 'z', -5, 5, 0.01).onChange(v => {
    material.uniforms.uDirPosition.value.z = v;
    directionalLightHelper.position.z = v;
})
dirFolder.add(directionalLightParams, 'specularPower', 1, 100, 1).onChange(v => material.uniforms.uDirSpecularPower.value = v)


// Point Light 1
const p1Folder = gui.addFolder('Point Light 1')
p1Folder.close()
p1Folder.addColor(pointLight1Params, 'color').onChange(v => material.uniforms.uPoint1Color.value.set(v))
p1Folder.add(pointLight1Params, 'intensity', 0, 5, 0.01).onChange(v => material.uniforms.uPoint1Intensity.value = v)
p1Folder.add(pointLight1Params, 'x', -5, 5, 0.01).onChange(v => material.uniforms.uPoint1Position.value.x = v)
p1Folder.add(pointLight1Params, 'y', -5, 5, 0.01).onChange(v => material.uniforms.uPoint1Position.value.y = v)
p1Folder.add(pointLight1Params, 'z', -5, 5, 0.01).onChange(v => material.uniforms.uPoint1Position.value.z = v)
p1Folder.add(pointLight1Params, 'specularPower', 1, 100, 1).onChange(v => material.uniforms.uPoint1SpecularPower.value = v)
p1Folder.add(pointLight1Params, 'decay', 0, 1, 0.01).onChange(v => material.uniforms.uPoint1Decay.value = v)

// Point Light 2
const p2Folder = gui.addFolder('Point Light 2')
p2Folder.close()
p2Folder.addColor(pointLight2Params, 'color').onChange(v => material.uniforms.uPoint2Color.value.set(v))
p2Folder.add(pointLight2Params, 'intensity', 0, 5, 0.01).onChange(v => material.uniforms.uPoint2Intensity.value = v)
p2Folder.add(pointLight2Params, 'x', -5, 5, 0.01).onChange(v => material.uniforms.uPoint2Position.value.x = v)
p2Folder.add(pointLight2Params, 'y', -5, 5, 0.01).onChange(v => material.uniforms.uPoint2Position.value.y = v)
p2Folder.add(pointLight2Params, 'z', -5, 5, 0.01).onChange(v => material.uniforms.uPoint2Position.value.z = v)
p2Folder.add(pointLight2Params, 'specularPower', 1, 100, 1).onChange(v => material.uniforms.uPoint2SpecularPower.value = v)
p2Folder.add(pointLight2Params, 'decay', 0, 1, 0.01).onChange(v => material.uniforms.uPoint2Decay.value = v)

const rendererFolder = gui.addFolder('Renderer')
rendererFolder.close()
rendererFolder.add(rendererParams, 'toneMapping', ['None', 'Linear', 'Reinhard', 'Cineon', 'ACESFilmic'])
rendererFolder.add(rendererParams, 'exposure', 0, 5, 0.01)

// Rotation
const rotationFolder = gui.addFolder('Rotation')
rotationFolder.close()
rotationFolder.add(rotationParams, 'speed', 0, 2, 0.01)

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

// directional Light Helper
const directionalLightHelper = new THREE.Mesh(
    new THREE.PlaneGeometry(),
    new THREE.MeshBasicMaterial({
        color: directionalLightParams.color,
        side: THREE.DoubleSide,
    })
)
directionalLightHelper.position.set(
    directionalLightParams.x,
    directionalLightParams.y,
    directionalLightParams.z
)
// scene.add(directionalLightHelper);

// point light helper
const pointLightHelper = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.1, 2),
    new THREE.MeshBasicMaterial()
)

pointLightHelper.material.color.setRGB(1.0, 0.1, 0.1);
pointLightHelper.position.set(0.0, 2.5, 0.0);
// scene.add(pointLightHelper);

// point light helper2
const pointLightHelper2 = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.1, 2),
    new THREE.MeshBasicMaterial()
)

pointLightHelper2.material.color.setRGB(0.1, 1.0, 0.5);
pointLightHelper2.position.set(2.0, 2.0, 2.0);
// scene.add(pointLightHelper2);


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Rotate objects
    const rotSpeed = rotationParams.speed
    if (suzanne) {
        suzanne.rotation.x = - elapsedTime * 0.1 * rotSpeed
        suzanne.rotation.y = elapsedTime * 0.2 * rotSpeed
    }

    sphere.rotation.x = - elapsedTime * 0.1 * rotSpeed
    sphere.rotation.y = elapsedTime * 0.2 * rotSpeed

    torusKnot.rotation.x = - elapsedTime * 0.1 * rotSpeed
    torusKnot.rotation.y = elapsedTime * 0.2 * rotSpeed

    // Tone Mapping
    switch (rendererParams.toneMapping) {
        case 'Linear': renderer.toneMapping = THREE.LinearToneMapping; break
        case 'Reinhard': renderer.toneMapping = THREE.ReinhardToneMapping; break
        case 'Cineon': renderer.toneMapping = THREE.CineonToneMapping; break
        case 'ACESFilmic': renderer.toneMapping = THREE.ACESFilmicToneMapping; break
        default: renderer.toneMapping = THREE.NoToneMapping; break
    }
    renderer.toneMappingExposure = rendererParams.exposure

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()