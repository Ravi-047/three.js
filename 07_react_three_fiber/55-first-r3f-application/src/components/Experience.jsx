import { extend, useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import CustomObject from './CustomObject';

extend({ OrbitControls });

const Experience = () => {
    const { camera, gl } = useThree();
    const cubeRef = useRef(null);
    const groupRef = useRef(null);

    useFrame((state, delta) => {
        const deltaTime = delta * 60
        if (!cubeRef.current || !groupRef.current) {
            return
        }
        cubeRef.current.rotation.y += 0.01 * deltaTime
        groupRef.current.rotation.y += 0.01 * deltaTime

        // camera animation 
        // const angle = state.clock.elapsedTime
        // state.camera.position.x = Math.sin(angle) * 8
        // state.camera.position.z = Math.cos(angle) * 8
        // state.camera.lookAt(0, 0, 0)

    })

    return (
        <>
            <orbitControls args={[camera, gl.domElement]} />
            <directionalLight position={[1, 2, 3]} intensity={3.0} />
            <ambientLight intensity={1.5} />
            <group ref={groupRef}>
                <mesh position-x={-2}>
                    <sphereGeometry />
                    <meshStandardMaterial color='orange' wireframe={false} />
                </mesh>
                <mesh ref={cubeRef} scale={1.5} position={[2, 0, 0]} rotation-y={Math.PI * 0.23}>
                    <boxGeometry />
                    <meshStandardMaterial color='red' wireframe={false} />
                </mesh>
            </group>
            <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
                <planeGeometry />
                <meshBasicMaterial color='green' wireframe={false} />
            </mesh>
            <CustomObject />
        </>
    )
}

export default Experience