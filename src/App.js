import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense } from 'react'
import { Canvas } from 'react-three-fiber'
import Model from './Model'

function App() {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[1, 1, 1]} />
      <OrbitControls />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
    </Canvas>
  );
}

export default App;
