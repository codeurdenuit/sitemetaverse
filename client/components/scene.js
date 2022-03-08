import * as THREE from 'three';

class Scene extends THREE.Scene {

  constructor() {
    super();
    this.initialised = false;
    this.currentWord = false;
    this.index = 0;
    this.root = new THREE.Object3D(); //moves relative to the VR user
    this.add(this.root);
  }

  async _init(indexUniverse) {
    this.index = indexUniverse;
    this.initialised = true;
    await this.init();
  }

  onOpenUniverse(cb) {
    this.openUniverse = cb;
  }

  onCloseUniverse(cb) {
    this.closeUniverse = cb;
  }

  onJumpUniverse(cb) {
    this.jumpUniverse = cb;
  }
}

export default Scene;