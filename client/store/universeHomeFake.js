import { Vector3 } from 'three';
const offsetZ = -250;
export default {
  nodes: [
    {
      camOrigin: { pc: new Vector3(0, 3.7, 0+ offsetZ), mo: new Vector3(0, 3.7 + 2, 6+ offsetZ), vr: new Vector3(0, 3.7, 0) },
      camTarget: { pc: new Vector3(0, 3.7, -7+ offsetZ), mo: new Vector3(0, 3.7 + 2, -1+ offsetZ), vr: new Vector3(0, 3.7, -7) }
    },
  ],
  scene: {
    moonPos: { pc: new Vector3(0, 60, -220), mo: new Vector3(0, 60, -220), vr: new Vector3(0, 80, -220) },
    treePos: { pc: new Vector3(0, 0, -7 + offsetZ), mo: new Vector3(0, 0, -7), vr: new Vector3(0, -2, -7 + offsetZ) },
    catPos: { pc: new Vector3(0, 0, -7 + offsetZ), mo: new Vector3(0, 0, -7), vr: new Vector3(0, -2, -7 + offsetZ) },
    areaPos: { pc: new Vector3(1.5, 0, -5.5 + offsetZ), mo: new Vector3(1.5, 0, -5.5), vr: new Vector3(1.5, 0, -5.5+ offsetZ) },
    rooms: [
      {
        position: { pc: new Vector3(3, 1, -13 + offsetZ), mo: new Vector3(3, 0, -13), vr: new Vector3(3, 1, -13 + offsetZ) },
        icon: 'icon-codeurdenuit',
        colorShape: 0x000001,
      },
      {
        position: { pc: new Vector3(-3, 1, -22 + offsetZ), mo: new Vector3(-3, 0, -22), vr: new Vector3(-3, 1, -22 + offsetZ) },
        icon: 'icon-youtube',
        iconColor: 0xff0000,
        colorShape: 0xffffff,
      },
      {
        position: { pc: new Vector3(3, 1, -31 + offsetZ), mo: new Vector3(3, 0, -31), vr: new Vector3(3, 1, -31 + offsetZ) },
        icon: 'icon-twitter',
        iconColor: 0x007FAA,
        colorShape: 0xffffff,
      },
      {
        position: { pc: new Vector3(-3, 1, -40 + offsetZ), mo: new Vector3(-3, 0, -40), vr: new Vector3(-3, 1, -40 + offsetZ) },
        icon: 'icon-univers',
        iconColor: 0xb3851f,
        colorShape: 0xffffff,
      }
    ]
  }
};
