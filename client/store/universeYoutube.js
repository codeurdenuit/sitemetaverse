import { Vector3 } from 'three';
export default {
  nodes: [
    {
      camOrigin: { pc: new Vector3(0.7, 1.7, -25.5), mo: new Vector3(3.5, 1.9, -23.5), vr: new Vector3(0.7, 1.6, -25.5) },
      camTarget: { pc: new Vector3(0.2, 0.9, -27.5), mo: new Vector3(-0.5, 0.9, -27.5), vr: new Vector3(0.2, 0.9, -27.5) },
      portalUniverse: 0,
      portalNode: 2,
      portalPos: { pc: new Vector3(0, 0, -19), mo: new Vector3(3, 0, -22), vr: new Vector3(0, 0, -19) },
    },
    {
      camOrigin: { pc: new Vector3(-2.3, 1.7, -25.5), mo: new Vector3(0.5, 1.9, -23.5), vr: new Vector3(-2.3, 1.6, -25.5) },
      camTarget: { pc: new Vector3(-2.8, 0.9, -27.5), mo: new Vector3(-3.5, 0.9, -27.5), vr: new Vector3(-2.8, 0.9, -27.5) },
    },
    {
      camOrigin: { pc: new Vector3(-5.3, 1.7, -25.5), mo: new Vector3(-2.5, 1.9, -23.5), vr: new Vector3(-5.3, 1.6, -25.5) },
      camTarget: { pc: new Vector3(-5.8, 0.9, -27.5), mo: new Vector3(-6.5, 0.9, -27.5), vr: new Vector3(-5.8, 0.9, -27.5) },
    },
    {
      camOrigin: { pc: new Vector3(-8.3, 1.7, -25.5), mo: new Vector3(-5.5, 1.9, -23.5), vr: new Vector3(-8.3, 1.6, -25.5) },
      camTarget: { pc: new Vector3(-8.8, 0.9, -27.5), mo: new Vector3(-9.5, 0.9, -27.5), vr: new Vector3(-8.8, 0.9, -27.5) },
    },
    {
      camOrigin: { pc: new Vector3(-11.6, 1.7, -25.5), mo: new Vector3(-8.5, 1.9, -23.5), vr: new Vector3(-11.6, 1.6, -25.5) },
      camTarget: { pc: new Vector3(-11.8, 0.9, -27.5), mo: new Vector3(-12.5, 0.9, -27.5), vr: new Vector3(-11.8, 0.9, -27.5) },
    },
    {
      camOrigin: { pc: new Vector3(-14.3, 1.7, -25.5), mo: new Vector3(-11.5, 1.9, -23.5), vr: new Vector3(-14.3, 1.6, -25.5) },
      camTarget: { pc: new Vector3(-14.8, 0.9, -27.5), mo: new Vector3(-15.5, 0.9, -27.5), vr: new Vector3(-14.8, 0.9, -27.5) },
    },
    {
      camOrigin: { pc: new Vector3(-17.3, 1.7, -25.5), mo: new Vector3(-15.5, 1.9, -23.5), vr: new Vector3(-17.3, 1.6, -25.5) },
      camTarget: { pc: new Vector3(-17.8, 0.9, -27.5), mo: new Vector3(-18.5, 0.9, -27.5), vr: new Vector3(-17.8, 0.9, -27.5) },
    },
    {
      camOrigin: { pc: new Vector3(-20.3, 1.7, -25.5), mo: new Vector3(-18.5, 1.9, -23.5), vr: new Vector3(-20.3, 1.6, -25.5) },
      camTarget: { pc: new Vector3(-20.9, 0.9, -27.5), mo: new Vector3(-21.5, 0.9, -27.5), vr: new Vector3(-20.9, 0.9, -27.5) },
    },
  ],
  scene: {
    title: { pc: new Vector3(-7, 2, -55), mo: new Vector3(-7-48, 3+4, -75), vr: new Vector3(-7, 2, -55) },
    logo: { pc: new Vector3(-29, 2, -54), mo: new Vector3(-5-48, 7+4, -74), vr: new Vector3(-28, 2, -54) },
    area: { pc: new Vector3(-0, 0, -18), mo: new Vector3(-20, 0, -30), vr: new Vector3(-0, 0, -18) },
    backVisible: { pc: true, mo: true, vr: false },
    back: { pc: new Vector3(0, 0.03, 0.5), mo: new Vector3(2, 0.03, 1.8), vr: new Vector3(-0, 0, -18) },
  }
};
