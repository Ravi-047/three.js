import { OrbitControls } from '@react-three/drei'
import { button, useControls } from 'leva'
import { Perf } from 'r3f-perf'

export default function Experience() {
    const { prefVisibile } = useControls({
        prefVisibile: true
    })

    const { position, color, visible } = useControls('Cube', {
        position: {
            value: {
                x: 2,
                y: 0,
                z: 0
            },
            step: 0.01,
            label: 'Box Position'
        },
        color: 'mediumpurple',
        visible: true,
        interval: {
            min: 0,
            max: 10,
            value: [4, 7],
        },
        clickMe: button(() => {
            console.log('Button clicked!')
        }),
        choice: { options: ['a', 'b', 'c'], value: 'b' }
    })

    return <>
        {prefVisibile && <Perf position="top-left" />}
        <OrbitControls makeDefault />

        <directionalLight position={[1, 2, 3]} intensity={4.5} />
        <ambientLight intensity={1.5} />

        <mesh position-x={- 2}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
        </mesh>

        <mesh position={[position.x, position.y, position.z]} scale={1.5} visible={visible}>
            <boxGeometry />
            <meshStandardMaterial color={color} />
        </mesh>

        <mesh position-y={- 1} rotation-x={- Math.PI * 0.5} scale={10}>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh>

    </>
}