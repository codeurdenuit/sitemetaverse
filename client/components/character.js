import * as THREE from 'three';
import store from '../store';

class Character extends THREE.Object3D {

  constructor() {
    super();

    const textureColor = store.getTexture('textureColor');
    const material = new THREE.MeshPhongMaterial({map: textureColor, shininess: 0, emissiveMap:textureColor, emissive: new THREE.Color(0x333333)});
    this.boneRoot = store.getObject3D('spine');
    this.meshCharacter = store.getObject3D('character');
    this.meshHeadset = this.boneRoot.getObjectByName('vrh');

    this.meshCharacter.material = material;
    this.meshHeadset.material = material;

    this.add(this.meshCharacter);
    this.add(this.boneRoot);
 
    this.meshHeadset.visible = false;
    this.meshCharacter.visible = false;
   
    this.mixer = new THREE.AnimationMixer(this.boneRoot);
    const animations =  store.getAnimations();
    const clipCodeur = THREE.AnimationClip.findByName(animations, 'codeur');
    const clipTwitter = THREE.AnimationClip.findByName(animations, 'twitter');
    const clipYoutube = THREE.AnimationClip.findByName(animations, 'youtube');
    const clipPlayvr = THREE.AnimationClip.findByName(animations, 'playvr');

    this.animations = {
      codeur: this.mixer.clipAction(clipCodeur, this.boneRoot),
      twitter: this.mixer.clipAction(clipTwitter, this.boneRoot),
      youtube: this.mixer.clipAction(clipYoutube, this.boneRoot),
      playvr: this.mixer.clipAction(clipPlayvr, this.boneRoot),
    };

    this.currentAnimpation = null;
    this.idHeadsetless = 'playvr';
  }

  playAnimation(id, position) {
    if(this.currentAnimpation === this.animations[id]) return;
    if (this.currentAnimpation) this.currentAnimpation.stop();
    if (this.animations[id]) {
      this.animations[id].play();
      this.currentAnimpation = this.animations[id];
      this.meshCharacter.visible = true;
      if (id === this.idHeadsetless) {
        this.meshHeadset.visible = true;
      }
      this.position.copy(position);
    }
  }

  stopAnimation() {
    if (this.currentAnimpation) {
      this.currentAnimpation.stop();
      this.currentAnimpation = null;
      this.meshCharacter.visible = false;
      this.meshHeadset.visible = false;
    }
  }

  update(dt) {
    this.mixer.update(dt);
  }
}

export default Character;
