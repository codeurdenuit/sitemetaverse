import { Vector3 } from 'three';
const offsetZ = -34;
const offsetX = -3;
const tweetsCtn = 12;
const radius = 6;
const radiusCam = 3;
const radiusCamMo = 0;
const angleStep = Math.PI / 9;
const angleRange = angleStep * tweetsCtn;
const angleStart = Math.PI / 2 - angleRange / 2;

const tar = [];
const ori = [];
const oriMo = [];
const tarMo = [];
for (let i = 0; i < tweetsCtn; i++) {
  const zTar = - radius * Math.sin(angleStep * i + angleStart) + offsetZ;
  const xTar = radius * Math.cos(angleStep * i + angleStart);
  const zCam = - radiusCam * Math.sin(angleStep * i + angleStart) + offsetZ;
  const xCam = radiusCam * Math.cos(angleStep * i + angleStart);
  const zCamMo = - radiusCamMo * Math.sin(angleStep * i + angleStart) + offsetZ;
  const xCamMo = radiusCamMo * Math.cos(angleStep * i + angleStart) + offsetX;
  const zTarMo = - radius * Math.sin(angleStep * i + angleStart) + offsetZ;
  const xTarMo = radius * Math.cos(angleStep * i + angleStart) + offsetX;
  tar.push(new Vector3(xTar, 1, zTar));
  ori.push(new Vector3(xCam, 1.8, zCam));
  tarMo.push(new Vector3(xTarMo, 1, zTarMo));
  oriMo.push(new Vector3(xCamMo, 1.6, zCamMo));
}

const nodes = [];
for (let i = 0; i < tweetsCtn; i++) {
  nodes.push({
    camOrigin: { pc: ori[i], mo: oriMo[i], vr: ori[i] },
    camTarget: { pc: tar[i], mo: tarMo[i], vr: tar[i] },
  });
}
nodes[0].portalUniverse = 0;
nodes[0].portalNode = Math.floor(tweetsCtn / 2);
nodes[0].portalPos = { pc: new Vector3(0, 0, -28 - 3), mo: new Vector3(-3, 0, -27 - 3), vr: new Vector3(0, 0, -28 - 3) };

export default {
  nodes,
  scene: {
    title: { pc: new Vector3(0, -0.3, -39), mo: new Vector3(-3, 0.2, -39), vr: new Vector3(0, -0.42, -39) },
    //back: { pc: new Vector3(0, 0.2, -39.5), mo: new Vector3(-3, 0.2, -39.5), vr: new Vector3(0, 0, -39.5) },
    area: { pc: new Vector3(0, 0, -34), mo: new Vector3(-3, -0, -34), vr: new Vector3(0, 0, -34) },
    buttonVisible: { pc: true, mo: true, vr: false },
    angleStep,
    angleStart
  }
};
