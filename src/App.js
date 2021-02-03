import { Physics } from '@react-three/cannon';
import { OrbitControls, PerspectiveCamera, Sky } from '@react-three/drei';
import { DefaultXRControllers, VRCanvas } from '@react-three/xr';
import { Suspense } from 'react';
import Game from './Game';
import Model from './Model';

function App() {
  return (
    <VRCanvas>
      <Sky />
      <DefaultXRControllers />
      <PerspectiveCamera makeDefault position={[0, 1.5, 0]} />
      {/* <OrbitControls target={[0, 0, -10]} /> */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        <Model position={[2, 0, -5]} />
      </Suspense>
      <Physics>
        <Game />
      </Physics>
    </VRCanvas>
  );
}

export default App;
