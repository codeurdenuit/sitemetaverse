import * as THREE from 'three';
import store from '../store';

class Cat extends THREE.Object3D {

  constructor() {
    super();

    this.meshCatQueue = store.getObject3D('catQueue').clone();
    this.boneCatQueue = store.getObject3D('Bone');
    this.meshCatQueue.material = new THREE.MeshBasicMaterial({color:0x000000});

    this.meshCat = store.getObject3D('catBody').clone();
    this.meshCat.material = new THREE.MeshBasicMaterial({color:0x000000});

    this.add( this.meshCatQueue);
    this.add(this.meshCat);
    this.add( this.boneCatQueue);

    this.mixer = new THREE.AnimationMixer(this.boneCatQueue);
    const catqueue = THREE.AnimationClip.findByName(store.getAnimations(), 'catqueue');

    this.animations = {
      catqueue: this.mixer.clipAction(catqueue,  this.boneCatQueue),
    };

    this.animations.catqueue.timeScale = 0.5;
  }

  playAnimation() {
    this.animations.catqueue.play();
  }

  stopAnimation() {
    this.animations.catqueue.stop();
  }

  update(dt) {
    this.mixer.update(dt);
  }

}

export default Cat;
