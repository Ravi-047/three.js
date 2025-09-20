import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */

// const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
// scene.add(ambientLight)

// const pointLight = new THREE.PointLight(0xffffff, 50)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)

// Minimal cost
// - AmbientLight
// - HemisphereLight

// Medium cost
// - DirectionalLight
// - PointLight

// High cost
// - SpotLight
// - RectAreaLight (not supported by all materials)

const ambientLight = new THREE.AmbientLight();
ambientLight.color = new THREE.Color(0xffffff);
ambientLight.intensity = 1;
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001).name('Ambient Light Intensity')
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0x00fffc, 2);
directionalLight.position.set(1, 0.25, 0);
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001).name('Directional Light Intensity')
scene.add(directionalLight)

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9);
gui.add(hemisphereLight, 'intensity').min(0).max(3).step(0.001).name('Hemisphere Light Intensity')
scene.add(hemisphereLight)

const pointLight = new THREE.PointLight(0xff9000, 1.5, 3);
pointLight.position.set(1, -0.5, 1);
const pointLightFolder = gui.addFolder('Point Light')
pointLightFolder.close()
pointLightFolder.add(pointLight, 'intensity').min(0).max(3).step(0.001).name('Point Light Intensity')
pointLightFolder.add(pointLight, 'distance').min(0).max(10).step(0.001).name('Point Light Distance')
scene.add(pointLight)


//only works with MeshStandardMaterial and MeshPhysicalMaterial
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1);
const rectAreaLightFolder = gui.addFolder('RectArea Light')
rectAreaLightFolder.close()
rectAreaLightFolder.add(rectAreaLight, 'intensity').min(0).max(10).step(0.001).name('Rect Area Light Intensity')
rectAreaLightFolder.add(rectAreaLight, 'width').min(0).max(10).step(0.001).name('Rect Area Light Width')
rectAreaLightFolder.add(rectAreaLight, 'height').min(0).max(10).step(0.001).name('Rect Area Light Height')
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)

const spotLight = new THREE.SpotLight(0x78ff00, 4.5, 10, Math.PI * 0.1, 0.25, 1);
spotLight.position.set(0, 2, 3);
const spotLightFolder = gui.addFolder('Spot Light')
spotLightFolder.close()
spotLightFolder.add(spotLight, 'intensity').min(0).max(10).step(0.001).name('Spot Light Intensity')
spotLightFolder.add(spotLight, 'distance').min(0).max(20).step(0.001).name('Spot Light Distance')
spotLightFolder.add(spotLight, 'angle').min(0).max(Math.PI * 0.5).step(0.001).name('Spot Light Angle')
spotLightFolder.add(spotLight, 'penumbra').min(0).max(1).step(0.001).name('Spot Light Penumbra')
spotLightFolder.add(spotLight, 'decay').min(0).max(5).step(0.001).name('Spot Light Decay')
scene.add(spotLight)
// spotLight.target.position.x = -0.75
spotLightFolder.add(spotLight.target.position, 'x').min(-5).max(5).step(0.001).name('Spot Light Target X')
scene.add(spotLight.target)

const sceneFolder = gui.addFolder('Scene Objects')
sceneFolder.close()
const lights = {
    ambient: ambientLight,
    directional: directionalLight,
    hemisphere: hemisphereLight,
    point: pointLight,
    rectArea: rectAreaLight,
    spot: spotLight
}
Object.entries(lights).forEach(([name, light]) => {
    sceneFolder.add(light, 'visible').name(`${name} light`)
})


//helpers
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
scene.add(hemisphereLightHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper)
window.requestAnimationFrame(() => {
    spotLightHelper.update()
})

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper)

const helperFolder = gui.addFolder('Light Helpers')
helperFolder.close()
const helpers = {
    hemisphereHelper: hemisphereLightHelper,
    directionalHelper: directionalLightHelper,
    pointHelper: pointLightHelper,
    spotHelper: spotLightHelper,
    rectAreaHelper: rectAreaLightHelper
}

Object.entries(helpers).forEach(([name, helper]) => {
    helperFolder.add(helper, 'visible').name(`${name}`)
})





/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)
const meshes = {
    Sphere: sphere,
    Cube: cube,
    Torus: torus,
    Plane: plane
}
const meshFolder = gui.addFolder('Mesh Objects')
meshFolder.close()
Object.entries(meshes).forEach(([name, mesh]) => {
    meshFolder.add(mesh, 'visible').name(name)
})

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()