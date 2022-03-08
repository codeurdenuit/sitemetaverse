import * as THREE from 'three';
import Grid from '../components/grid';
import materialLineGradiant from '../materials/materialLineGradiant';
const geometryGrid = new Grid(3 * 100, 3 * 100, 100, 100);

export default class Area extends THREE.Line {

  constructor() {
    super();
    this.geometry = geometryGrid;
    this.material = materialLineGradiant;
  }

  update(camera) {
    this.material.uniforms.origin.value.set(camera.position.x, 0, camera.position.z);
  }

}
