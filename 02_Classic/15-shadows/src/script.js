import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'


// Texture

const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')
bakedShadow.colorSpace = THREE.SRGBColorSpace
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')
// simpleShadow.repeat.set(1, 1)
// simpleShadow.wrapS = THREE.RepeatWrapping
// simpleShadow.wrapT = THREE.RepeatWrapping

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
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(directionalLight)

directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024 //always give value power of 2
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2
directionalLight.shadow.radius = 10
gui.add(directionalLight, 'castShadow').name('directional light shadow')

const directionLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionLightCameraHelper)
directionLightCameraHelper.visible = false
gui.add(directionLightCameraHelper, 'visible').name('directional light helper')


// Spot light
const spotLight = new THREE.SpotLight(0xffffff, 2.6, 10, Math.PI * 0.3)
spotLight.position.set(0, 2, 2)
scene.add(spotLight)
scene.add(spotLight.target)

const spotLightFolder = gui.addFolder('Spot Light')
spotLightFolder.close()

spotLightFolder.add(spotLight, 'intensity').min(0).max(3).step(0.001)
spotLightFolder.add(spotLight.position, 'x').min(- 5).max(5).step(0.001)
spotLightFolder.add(spotLight.position, 'y').min(- 5).max(5).step(0.001)
spotLightFolder.add(spotLight.position, 'z').min(- 5).max(5).step(0.001)
spotLightFolder.add(spotLight.target.position, 'x').min(- 5).max(5).step(0.001).name('target x')
spotLightFolder.add(spotLight.target.position, 'y').min(- 5).max(5).step(0.001).name('target y')
spotLightFolder.add(spotLight.target.position, 'z').min(- 5).max(5).step(0.001).name('target z')

spotLight.castShadow = true
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6
spotLight.shadow.camera.fov = 30
spotLight.shadow.radius = 10
spotLightFolder.add(spotLight, 'castShadow').name('spot light shadow')

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(spotLightCameraHelper)
spotLightCameraHelper.visible = false
spotLightFolder.add(spotLightCameraHelper, 'visible').name('spot light helper')

// Point light
const pointLight = new THREE.PointLight(0xffffff, 2.7)
pointLight.position.set(-1, 1, 0)
scene.add(pointLight)

const pointLightFolder = gui.addFolder('Point Light')
pointLightFolder.close()

pointLightFolder.add(pointLight, 'intensity').min(0).max(3).step(0.001)
pointLightFolder.add(pointLight.position, 'x').min(- 5).max(5).step(0.001)
pointLightFolder.add(pointLight.position, 'y').min(- 5).max(5).step(0.001)
pointLightFolder.add(pointLight.position, 'z').min(- 5).max(5).step(0.001)

pointLight.castShadow = true
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5
pointLightFolder.add(pointLight, 'castShadow').name('point light shadow')

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
scene.add(pointLightCameraHelper)
pointLightCameraHelper.visible = false
pointLightFolder.add(pointLightCameraHelper, 'visible').name('point light helper')

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    // new THREE.MeshBasicMaterial({ map: bakedShadow })
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5
plane.receiveShadow = true

scene.add(sphere, plane)

const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow
    })
)
sphereShadow.rotation.x = - Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.01
sphereShadow.renderOrder = 1
scene.add(sphereShadow)

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
renderer.shadowMap.enabled = false
renderer.shadowMap.type = THREE.PCFSoftShadowMap //default THREE.PCFShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update sphere
    sphere.position.x = Math.cos(elapsedTime) * 1.5
    sphere.position.z = Math.sin(elapsedTime) * 1.5
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))

    // Update shadow
    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.7

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()