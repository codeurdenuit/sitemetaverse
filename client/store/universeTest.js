import { Vector3 } from 'three';
const offset = -250;
export default {
  nodes: [
    {
      camOrigin: { pc: new Vector3(1 + offset, 1.7, -48), mo: new Vector3(0.7, 1.7, -50), vr: new Vector3(0.7, 1.7, -50) },
      camTarget: { pc: new Vector3(0.5 + offset, 1.1, -50), mo: new Vector3(0.2, 1.1, -48.5), vr: new Vector3(0.2, 1.1, -48.5) },
    },
    {
      portalUniverse: 4,
      portalNode: 0,
      portalPos: { pc: new Vector3(0, 0, offset), mo: new Vector3(0, 0, offset), vr: new Vector3(0, 0, offset) },
    },
  ],
  scene: {

  }
};
