import { Physics, useBox, usePlane } from '@react-three/cannon'
import { useXREvent } from '@react-three/xr'
import { useRef, useState } from 'react'
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
    const [state, setState] = useState({ value: "idle" });
    const [ref, api] = useBox(() => ({ mass: 1, args: [0.5, 0.5, 0.5], position: [0, 0, -20] }));

    const prevPosition = useRef();
    const speed = useRef();

    const onDown = (event) => {
        console.log('down', event);
        const { x, y, z } = event.intersections[0].point;
        setState("dragging");
        api.position.set(x, y, z);
        prevPosition.current = event.intersections[0].point.clone();
    }

    const onMove = (event) => {
        // console.log('move', event);
        if (state === "dragging") {
            // console.log('yes');
            const { x, y, z } = event.intersections[0].point;
            api.position.set(x, y, z);
            api.velocity.set(0, 0, 0);

            const currentPosition = event.intersections[0].point;
            if (prevPosition.current) {
                if (!speed.current) {
                    speed.current = new THREE.Vector3();
                }

                const newSpeed = currentPosition.clone().sub(prevPosition.current).multiplyScalar(60);

                speed.current.multiplyScalar(0.9).add(newSpeed.multiplyScalar(0.1));
                // console.log(speed.current.x);
            }
            prevPosition.current = currentPosition.clone();
            // console.log('hey');
        }
    }

    const onUp = (event) => {
        console.log('up');
        setState("idle");
        const { x, y, z } = event.intersections[0].point;
        // api.position.set(x, y, z);
        console.log(x, y, z);

        api.velocity.set(speed.current.x, speed.current.y, speed.current.z);
    }

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
        <>
            <mesh position={[0, 5, -10]} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}>
                <planeBufferGeometry attach="geometry" args={[10, 10]} />
                <meshBasicMaterial attach="material" visible={false} />
            </mesh>
            <Plane />
            <Cube position={[0, 2, -10]} />
            <mesh ref={ref}>
                <boxBufferGeometry attach="geometry" args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color={"red"} />
            </mesh>
            {cubes.map((cube, i) =>
                <Cube key={i} size={cube.small ? [0.1, 0.1, 0.1] : [1, 1, 1]} position={cube.position} />
            )}
        </>
    )
}