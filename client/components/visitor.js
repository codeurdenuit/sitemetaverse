import store from '../store';
import * as THREE from 'three';

export default class Visitor {

  constructor() {
    const material = new THREE.MeshPhongMaterial({map:  store.getTexture('textureColor'), shininess: 0});
    this.meshHeadset = store.getObject3D('vrhVisitor').clone();
    this.meshControllerR = store.getObject3D('vrcR').clone();
    this.meshControllerL = store.getObject3D('vrcL').clone();
    this.meshHeadset.material = material;
    this.meshControllerR.material = material;
    this.meshControllerL.material = material;
  }

  update(userData, universes, userPosition) {
    this.meshHeadset.position.x = userData[0] + userData[3];
    this.meshHeadset.position.y = userData[1] + userData[4];
    this.meshHeadset.position.z = userData[2] + userData[5];
    this.meshHeadset.rotation.x = userData[6];
    this.meshHeadset.rotation.y = userData[7];
    this.meshHeadset.rotation.z = userData[8];

    this.meshControllerR.position.x = userData[10] + userData[3];
    this.meshControllerR.position.y = userData[11] + userData[4];
    this.meshControllerR.position.z = userData[12] + userData[5];
    this.meshControllerR.rotation.x = userData[13];
    this.meshControllerR.rotation.y = userData[14];
    this.meshControllerR.rotation.z = userData[15];

    this.meshControllerL.position.x = userData[16] + userData[3];
    this.meshControllerL.position.y = userData[17] + userData[4];
    this.meshControllerL.position.z = userData[18] + userData[5];
    this.meshControllerL.rotation.x = userData[19];
    this.meshControllerL.rotation.y = userData[20];
    this.meshControllerL.rotation.z = userData[21];
    const indexUniverse = userData[9];
    if (universes[userData[9]].initialised) {
      if (this.meshHeadset.parent !== universes[indexUniverse].root) {
        universes[indexUniverse].root.add(this.meshHeadset);
        universes[indexUniverse].root.add(this.meshControllerR);
        universes[indexUniverse].root.add(this.meshControllerL);
      }
    } else {
      this.meshHeadset.removeFromParent();
      this.meshControllerR.removeFromParent();
      this.meshControllerL.removeFromParent();
    }

    const x = this.meshHeadset.matrixWorld.elements[12];
    const z = this.meshHeadset.matrixWorld.elements[14];
    this.meshHeadset.visible = (Math.abs(userPosition.x - x) > 0.3 || Math.abs(userPosition.z - z) > 0.3);
  }

  dismount() {
    this.meshHeadset.removeFromParent();
  }
}

Visitor.parse = function parse(inputs, camera, userPos, indexUniverse) {
  const camPos = camera.position;
  const camRot = camera.rotation;
  const conRPos = inputs.controllerRight.position;
  const conRRot = inputs.controllerRight.rotation;
  const conLPos = inputs.controllerLeft.position;
  const conLRot = inputs.controllerLeft.rotation;
  return [
    camPos.x, camPos.y, camPos.z,
    userPos.x, userPos.y, userPos.z,
    camRot.x, camRot.y, camRot.z,
    indexUniverse,
    conRPos.x, conRPos.y, conRPos.z,
    conRRot.x, conRRot.y, conRRot.z,
    conLPos.x, conLPos.y, conLPos.z,
    conLRot.x, conLRot.y, conLRot.z,
    inputs.xr ? 1 : 0
  ];
};
