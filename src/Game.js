import { Physics, useBox, useLockConstraint, usePlane, usePointToPointConstraint, useSphere } from '@react-three/cannon'
import { useController, useXREvent } from '@react-three/xr'
import { useRef, useState } from 'react'
import { useFrame } from 'react-three-fiber'
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

function Grab({ grabber, grabbed }) {
    console.log('render grab', grabber, grabbed);
    useLockConstraint(grabber, grabbed);

    return null;
}

export default function Game() {
    const rightController = useController("right")
    const [cubes, setCubes] = useState([]);
    const [state, setState] = useState("idle");
    const [boxRef, boxApi] = useBox(() => ({ mass: 0.1, args: [0.1, 0.1, 0.1], position: [2, 1, -10] }));

    const [grabberRef, grabberApi] = useSphere(() => ({
        mass: 0,
        args: 0.1, // to check: is this required?
        position: [-2, 1, -10],
        collisionFilterGroup: 0,
        collisionFilterMask: 0  // to check: what does this do?
    }));

    const onDown = (event) => {
        setState("grabbing");
        const position = event.intersections[0].point;
        grabberApi.position.set(position.x, position.y, position.z);
        boxApi.position.set(position.x, position.y, position.z);

    }

    const onMove = (event) => {
        // console.log('move', event);
        if (state === "grabbing") {
            // console.log('hey');
            const position = event.intersections[0].point;
            grabberApi.position.set(position.x, position.y, position.z);
        }
    }

    const onUp = (event) => {
        setState("idle");
    }

    useXREvent('squeezestart', (event) => {
        setState("grabbing2");
        const position = rightController.grip.position;
        grabberApi.position.set(position.x, position.y, position.z);
        boxApi.position.set(position.x, position.y, position.z);
    })

    useFrame(() => {
        if (state === "grabbing2") {
            const { position, rotation } = rightController.grip;
            grabberApi.position.set(position.x, position.y, position.z);
            grabberApi.rotation.set(rotation.x, rotation.y, rotation.z);
        }
    })

    useXREvent('squeezeend', (event) => {
        setState("idle");
    })

    return (
        <>
            <mesh position={[0, 5, -10]} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}>
                <planeBufferGeometry attach="geometry" args={[10, 10]} />
                <meshBasicMaterial attach="material" visible={false} />
            </mesh>
            <Plane />
            <Cube position={[0, 2, -10]} />
            <mesh ref={boxRef}>
                <boxBufferGeometry attach="geometry" args={[0.1, 0.1, 0.1]} />
                <meshStandardMaterial color={"red"} />
            </mesh>
            <mesh ref={grabberRef}>
                <sphereBufferGeometry attach="geometry" args={[0.1, 16, 16]} />
                <meshBasicMaterial transparent={true} color={"orange"} opacity={0.5} />
            </mesh>
            {state === "grabbing" && <Grab grabber={grabberRef} grabbed={boxRef} />}
            {state === "grabbing2" && <Grab grabber={grabberRef} grabbed={boxRef} />}
            {cubes.map((cube, i) =>
                <Cube key={i} size={cube.small ? [0.1, 0.1, 0.1] : [1, 1, 1]} position={cube.position} />
            )}
        </>
    )
}