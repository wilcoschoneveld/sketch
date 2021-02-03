import { Physics, useBox, usePlane } from '@react-three/cannon'
import { useXREvent } from '@react-three/xr'
import { useState } from 'react'
import * as THREE from "three"

function Plane(props) {
    const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
    return (
        <mesh ref={ref} />
    )
}

function Cube(props) {
    const { size: args, position } = props;
    const [ref] = useBox(() => ({ mass: 1, args, position }))

    return (
        <mesh ref={ref} position={position}>
            <boxBufferGeometry attach="geometry" args={args} />
            <meshStandardMaterial color={"orange"} />
        </mesh>
    )
}

export default function Game() {
    const [cubes, setCubes] = useState([]);

    const onClick = (event) => {
        const { x, y, z } = event.intersections[0].point;
        const newCube = {
            small: false,
            position: [x, y, z]
        }
        setCubes([...cubes, newCube]);
    }

    useXREvent('squeeze', (event) => {
        console.log(event);

        const { x, y, z } = event.controller.controller.position;
        const newCube = {
            small: true,
            position: [x, y, z]
        }
        setCubes([...cubes, newCube]);
    })

    return (
        <Physics>
            <mesh position={[0, 5, -10]} onClick={onClick}>
                <planeBufferGeometry attach="geometry" args={[10, 10]} />
                <meshBasicMaterial attach="material" visible={false} />
            </mesh>
            <Plane />
            <Cube position={[0, 2, -10]} />
            {cubes.map((cube, i) =>
                <Cube key={i} size={cube.small ? [0.1, 0.1, 0.1] : [1, 1, 1]} position={cube.position} />
            )}
        </Physics>
    )
}