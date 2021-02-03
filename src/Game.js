import { Physics, usePlane, useBox } from '@react-three/cannon'

function Plane(props) {
    const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
    return (
        <mesh ref={ref} />
    )
}

function Cube(props) {
    const [ref] = useBox(() => ({ mass: 1, position: [0, 2, -10], ...props }))

    return (
        <mesh ref={ref}>
            <boxBufferGeometry attach="geometry" />
            <meshStandardMaterial color={"orange"} />
        </mesh>
    )
}

export default function Game() {
    return (
        <Physics>
            <Plane />
            <Cube />
        </Physics>
    )
}