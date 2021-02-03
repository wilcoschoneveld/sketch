import { OrbitControls, PerspectiveCamera, Sky } from '@react-three/drei';
import { DefaultXRControllers, VRCanvas } from '@react-three/xr';
import { Suspense } from 'react';
import Model from './Model';

function App() {
  return (
    <VRCanvas>
      <Sky />
      <DefaultXRControllers />
      <PerspectiveCamera makeDefault position={[1, 1, 1]} />
      <OrbitControls />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
    </VRCanvas>
  );
}

export default App;
