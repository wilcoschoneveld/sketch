import { Physics, useBox, usePlane } from '@react-three/cannon'
import { useState } from 'react'

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
    const [cubes, setCubes] = useState([]);

    const onClick = (event) => {
        const { x, y, z } = event.intersections[0].point;
        setCubes([...cubes, [x, y, z]]);
    }

    return (
        <Physics>
            <mesh position={[0, 5, -10]} onClick={onClick}>
                <planeBufferGeometry attach="geometry" args={[10, 10]} />
                <meshBasicMaterial attach="material" visible={false} />
            </mesh>
            <Plane />
            <Cube />
            {cubes.map((cube, i) =>
                <Cube key={i} position={cube} />
            )}
        </Physics>
    )
}