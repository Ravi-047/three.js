import * as THREE from 'three'
import { gsap } from "gsap";
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)


// Time
// let time = Date.now()
// const clock = new THREE.Clock()
gsap.to(mesh.position, { duration: 1, delay: 1, y: 2, yoyo: true, repeat: -1 })

// Animations
const tick = () => {
    // const currentTime = Date.now();
    // const deltaTime = currentTime - time;
    // time = currentTime;

    // mesh.rotation.y += 0.001 * deltaTime

    // const elapsedTime = clock.getElapsedTime()
    // mesh.rotation.y = elapsedTime * Math.PI * 2
    // mesh.position.y = Math.sin(elapsedTime)
    // mesh.position.x = Math.cos(elapsedTime)
    // camera.lookAt(mesh.position)
    // Render
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()