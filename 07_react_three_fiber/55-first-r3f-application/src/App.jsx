import { Canvas } from "@react-three/fiber"
import Experience from "./components/Experience"
import * as THREE from 'three'

const App = () => {
    return (
        <Canvas
            // orthographic
            // flat // linear tonemapping
            // dpr={[1, 2]} // same setting handle by R3F
            gl={{
                antialias: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                outputColorSpace: THREE.SRGBColorSpace
            }}
            camera={{
                fov: 60,
                // zoom: 100,
                near: 0.1,
                far: 200,
                position: [3, 2, 6]
            }}
        >
            <Experience />
        </Canvas>
    )
}

export default App