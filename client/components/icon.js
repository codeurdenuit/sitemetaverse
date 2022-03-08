import * as THREE from 'three';
import store from '../store';
const _xAxis = new THREE.Vector3(1, 0, 0);
const _yAxis = new THREE.Vector3(0, 1, 0);
const _zAxis = new THREE.Vector3(0, 0, 1);
const _v1 = new THREE.Vector3();
const _q1 = new THREE.Quaternion();
const vr = 'vr';
const iconSize = 1;
const geometryCylinder = new THREE.CylinderGeometry( iconSize, iconSize, 0.15, 30 );
geometryCylinder.rotateZ(Math.PI/2);
customUV(geometryCylinder, iconSize, {x:0.00390625, y:0.01953125, w:0.0791015625});


export default class Icon extends THREE.Mesh {

  constructor(meshName, color, colorShape) {
    super();
    const textureColor = store.getTexture('textureColor');
    if(color) {
      this.materialBlur = new THREE.MeshPhongMaterial({ color:color, shininess: 5, emissive: new THREE.Color(color).multiplyScalar(0.7) });
    } else {
      this.materialBlur = new THREE.MeshPhongMaterial({ map: textureColor, shininess: 5, emissiveMap: textureColor , emissive:0xA0A1A2});
    }
    if(colorShape) {
      this.materialShape = new THREE.MeshPhongMaterial({ color:colorShape, shininess: 5, emissive: new THREE.Color(colorShape).multiplyScalar(0.8) });
    }else {
      this.materialShape = new THREE.MeshPhongMaterial({ map: textureColor, shininess: 5, emissiveMap: textureColor,emissive:0xaaaaaa});
    }

    if(color) {
      this.materialFocus = new THREE.MeshPhongMaterial({ color:color, shininess: 5, emissive: new THREE.Color(color) });
    } else {
      this.materialFocus = new THREE.MeshPhongMaterial({ map: textureColor, shininess: 5, emissiveMap: textureColor , emissive:0xffffff});
    }

    this.geometry = geometryCylinder;
    this.material = this.materialBlur;

    this.meshShape = store.getObject3D(meshName).clone();
    this.meshShape.material = this.materialShape;
    this.add(this.meshShape);

    this.click = null;
    this.size = 1;
    this.storeSize = 1;
    this.sizeScreen = 0.05;
    this.tempoClickValue = 0;
    this.tempoClickOrder = 1;
    this.storedPoition = new THREE.Vector3();
    this.storedQuaternion = new THREE.Quaternion();
    this.screenPosition = new THREE.Vector2();
    this.quaternionTemp = new THREE.Quaternion();
    this.positionTemp = new THREE.Vector3();
    this.scaleTemp = new THREE.Vector3();
    this.screened = false;
    this.animationScreenRunning = false;
    this.animationEnterRuning = false;
    this.animationProgress = 0;
    this.animationRollback = false;
    this.onBlur();
  }

  onFocus() {
    document.body.style.cursor = 'pointer';
    this.scale.multiplyScalar(1.05);
    this.material = this.materialFocus;
  }

  onBlur() {
    this.material = this.materialBlur;
  }

  onClick(callback) {
    this.click = callback;
  }

  update(dt, raycaster, inputs, camera) {
    if (this.animationScreenRunning) {
      this.animationScreen(dt, camera);
    } else if (this.animationEnterRunning) {
      this.animationEnter(dt);
    } else {
      if (this.screened) {
        if(inputs.xr) {
          this.position.y = -2;
          this.size = this.storeSize;
        }else {
          this.forceSceenPositon(camera);
        }
      }
    }
    this.checkInteracting(raycaster, dt, inputs);
  }

  checkInteracting(raycaster, dt, inputs) {
    this.scale.set(this.size, this.size, this.size);
    if (raycaster.intersectObject(this).length) {
      if (inputs.mouseButton) {
        this.onFocus();
        if (this.click && this.animationProgress === 0) {
          if (this.tempoClickValue === 0) {
            this.click();
            this.tempoClickValue = this.tempoClickOrder;
          }
        }
      } else {
        this.onFocus();
      }
    } else {
      this.onBlur();
    }
    this.tempoClickValue -= dt;
    this.tempoClickValue = Math.max(0, this.tempoClickValue);
  }

  saveState() {
    this.storedPoition.copy(this.position);
    this.storeSize = this.size;
  }

  startAnimationEnter() {
    
    this.position.z = this.storedPoition.z - 600;
    this.animationEnterRunning = true;
  }

  startAnimationScreen(x, y) {
    this.storedQuaternion.copy(this.quaternion);
    this.screenPosition.set(x, y);
    this.screened = true;
    this.animationScreenRunning = true;
    this.animationProgress = 0.6;
    this.animationRollback = false;
  }

  startAnimationUnscreen() {
    this.screened = false;
    this.animationRollback = true;
    this.animationScreenRunning = true;
    this.animationProgress = 1;
  }

  toScreen(x, y) {
    this.screened = true;
    this.screenPosition.set(x, y);
    this.size = this.sizeScreen;
  }

  init() {
    this.position.copy(this.storedPoition);
    this.screened = false;
  }

  animationEnter(dt) {
    const dz = this.storedPoition.z - this.position.z;
    this.position.z += dt * dz * 7;
    if (Math.abs(this.position.z - this.storedPoition.z) < 0.1) {
      this.position.z = this.storedPoition.z;
      this.animationEnterRunning = false;
    }
  }

  animationScreen(dt, camera) {
    this.animationProgress -= dt;

    if(this.animationProgress<0) this.animationProgress=0; 
  
    let p1 = 1 - this.animationProgress;
    let p2 = this.animationProgress;
    if (this.animationRollback) {
      p1 = p2;
      p2 = 1 - this.animationProgress;
    }

    if(store.device !== vr) {
      this.positionTemp.copy(camera.position.clone());
      this.parent.worldToLocal(this.positionTemp);
      this.quaternionTemp.copy(camera.quaternion);
      _v1.copy(_zAxis).applyQuaternion(this.quaternionTemp);
      this.positionTemp.add(_v1.multiplyScalar(-1));
      _v1.copy(_xAxis).applyQuaternion(this.quaternionTemp);
      this.positionTemp.add(_v1.multiplyScalar(store.ratio * this.screenPosition.x));
      _v1.copy(_yAxis).applyQuaternion(this.quaternionTemp);
      this.positionTemp.add(_v1.multiplyScalar(this.screenPosition.y));
      _q1.setFromAxisAngle(_yAxis, -Math.PI / 2);
      this.quaternionTemp.multiply(_q1);
  
      this.position.x = this.positionTemp.x * p1 + this.storedPoition.x * p2;
      this.position.y = this.positionTemp.y * p1 + this.storedPoition.y * p2;
      this.position.z = this.positionTemp.z * p1 + this.storedPoition.z * p2;
  
      this.quaternion.x = this.quaternionTemp.x * p1 + this.storedQuaternion.x * p2;
      this.quaternion.y = this.quaternionTemp.y * p1 + this.storedQuaternion.y * p2;
      this.quaternion.z = this.quaternionTemp.z * p1 + this.storedQuaternion.z * p2;
      this.quaternion.w = this.quaternionTemp.w * p1 + this.storedQuaternion.w * p2;
  
      this.size = this.sizeScreen * p1 + this.storeSize * p2;
      this.scale.x = this.size;
      this.scale.y = this.size; 
      this.scale.z = this.size;
    } else {
      this.position.copy(this.storedPoition);
      this.position.y = p1 * -2 + p2 * 1;
      this.size = this.storeSize;
      this.quaternion.copy(this.storedQuaternion);
    }

    if (this.animationProgress === 0) {
      this.animationScreenRunning = false;
      this.animationRollback = false;
    }

  }

  forceSceenPositon(camera) {
    this.positionTemp.copy(camera.position.clone());
    this.parent.worldToLocal(this.positionTemp);
    this.quaternionTemp.copy(camera.quaternion);
    _v1.copy(_zAxis).applyQuaternion(this.quaternionTemp);
    this.positionTemp.add(_v1.multiplyScalar(-1));
    _v1.copy(_xAxis).applyQuaternion(this.quaternionTemp);
    this.positionTemp.add(_v1.multiplyScalar(store.ratio * this.screenPosition.x));
    _v1.copy(_yAxis).applyQuaternion(this.quaternionTemp);
    this.positionTemp.add(_v1.multiplyScalar(this.screenPosition.y));

    _q1.setFromAxisAngle(_yAxis, -Math.PI / 2);
    this.quaternionTemp.multiply(_q1);

    this.position.copy(this.positionTemp);
    this.quaternion.copy(this.quaternionTemp);
    this.scale.set(this.size, this.size, this.size);
  }
}

function customUV(geometry, size, line) {
  const pos = geometry.attributes.position.array;
  const uv = geometry.attributes.uv.array;
  const count = pos.length/3;
  const y = line.y;
  const x = line.x;
  const w = line.w;
  for (let i = 0; i < count; i += 1) {
    const z1 = pos[i * 3 + 2];
    const percentW = (z1+size)/(2*size);
    uv[i * 2 + 0] = x+w-w*percentW;
    uv[i * 2 + 1] = y;
  }
}
