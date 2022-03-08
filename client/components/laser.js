import * as THREE from 'three';
class Laser extends THREE.Line {

  constructor() {
    super();
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -3), new THREE.Vector3(0, 0, 0)]);
    this.geometry = lineGeo;
    this.material = lineMaterial;
  }

  update(inputs) {
    this.position.copy(inputs.controllerRight.position);
    this.rotation.copy(inputs.controllerRight.rotation);
  }

}

export default Laser;