import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import ThreeMeshUI from 'three-mesh-ui';
import  MultiVisitor  from './multiVisitor';

import store from '../store';
class Metaverse {

  constructor() {
    this.clock = new THREE.Clock(true);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    const pixelDensity = 1.5*window.innerWidth<window.innerHeight ? 1.5 : 1;//mobile browser downgrades canvas resolution
    this.renderer.setSize(window.innerWidth*pixelDensity, window.innerHeight*pixelDensity, false);
    document.body.appendChild(this.renderer.domElement);
    if(pixelDensity < 1.5) {
      document.body.appendChild(VRButton.createButton(this.renderer));
    }
    this.renderer.xr.enabled = true;
    this.previousXR = false;
    this.universes = {};
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.05, 2000);
    this.camera.userData.speed = 0;
    this.camera.userData.direction = new THREE.Vector3();
    this.morphPortal = 0;
    this.distancePortail = 99; 
    this.opened = false;
    this.tempoClose = null;
    this.tempMatrix = new THREE.Matrix4();
    this.userPosition = new THREE.Vector3(0, 0, 0);//Virtual position in world. Move only in VR Mode (World move, not user);
    this.userPositionSave =  new THREE.Vector3(0, 0, 0);
    this.cameraTarget = new THREE.Vector3();//used in browser mode for camera path
    this.raycaster = new THREE.Raycaster();
    this.multiVisitor = null;

    this.eventsWindow = ['resize', 'pointermove', 'pointerdown', 'pointerup', 'touchstart', 'touchend', 'wheel'];
    this.eventsVR = ['selectstart', 'selectend', 'squeezestart', 'squeezeend'];
    this.eventsCallbackVR = [];
    this.eventsCallbackWindow = [];
    this.inputs = {
      controllerLeftButton1: false,
      controllerLeftButton2: false,
      controllerRightButton1: false,
      controllerRightButton2: false,
      mouseButton: false,
      mousePosition: new THREE.Vector2(1, 1),
    };

    this.sceneForeground = null;
    this.sceneBackground = null;
    this.sceneWall = new THREE.Scene();
    this.sceneDoor = new THREE.Scene();
    this.sceneForegroundId = '';
    this.sceneBackgroundId = '';

    this.meshWall = store.getObject3D('wall');
    this.meshDoor = store.getObject3D('door');
    const materialWall = new THREE.MeshPhongMaterial({ color: 0x00ff00, opacity: 0.0, transparent: true });
    this.meshWall.material = materialWall;
    this.meshDoor.material = materialWall;
    this.rootWall = new THREE.Object3D();
    this.rootDoor = new THREE.Object3D();
    this.rootWall.add(this.meshWall);
    this.rootDoor.add(this.meshDoor);
    this.sceneWall.add(this.rootWall);
    this.sceneDoor.add(this.rootDoor);

    this.portailDirection = new THREE.Vector3();
    this.portailPosition = new THREE.Vector3();

    this.updateDevice();

    setTimeout(this.syncMultiVR.bind(this), 10000);
  }

  prepareWindowEvent(eventName) {
    const callback = this[eventName].bind(this);
    window.addEventListener(eventName, callback);
    this.eventsCallbackWindow.push(callback);
  }

  prepareVREvent(eventName) {
    const eventNameLeft = `${eventName}Left`;
    const callbackLeft = this[eventNameLeft].bind(this);
    this.controllerLeft.addEventListener(eventName, callbackLeft);
    const eventNameRight = `${eventName}Right`;
    const callbackRight = this[eventNameRight].bind(this);
    this.controllerRight.addEventListener(eventName, callbackRight);
    this.eventsCallbackVR.push(callbackLeft, callbackRight);
  }

  prepareVREvents() {
    for (let i = 0; i < this.eventsVR.length; i++) {
      this.prepareVREvent(this.eventsVR[i]);
    }
  }

  prepareWindowEvents() {
    for (let i = 0; i < this.eventsWindow.length; i++) {
      this.prepareWindowEvent(this.eventsWindow[i]);
    }
  }

  removeWindowEvents() {
    for (let i = 0; i < this.eventsWindow.length; i++) {
      window.removeEventListener(this.eventsWindow[i], this.eventsCallbackWindow[i]);
    }
  }

  removeVREvents() {
    for (let i = 0; i < this.eventsVR.length; i++) {
      this.controllerLeft.removeEventListener(this.eventsVR[i], this.eventsCallbackVR[i * 2]);
      this.controllerRight.removeEventListener(this.eventsVR[i], this.eventsCallbackVR[i * 2 + 1]);
    }
  }

  async start(indexUniverse) {
    await this.initUniverse(indexUniverse);
    const node = store.universes[indexUniverse].nodes[store.indexNode];
    this.cameraTarget.copy(node.camTarget[store.device]);
    this.camera.position.copy(node.camOrigin[store.device]);

    if (this.renderer.xr.enabled) {
      this.controllerLeft = this.renderer.xr.getController(0);
      this.controllerRight = this.renderer.xr.getController(1);
      this.inputs.controllerLeft = this.controllerLeft;
      this.inputs.controllerRight = this.controllerRight;
      this.prepareVREvents();
      this.prepareWindowEvents();
      this.renderer.setAnimationLoop(() => {
        let dt = this.clock.getDelta();
        dt = Math.min(dt, 0.1);
        this.render(this.renderer);
        this.update(dt, this.inputs, this.renderer);
      });
    } else {
      this.prepareWindowEvents();
      const update = () => {
        this.requestAnimation = requestAnimationFrame(update);
        this.render(this.renderer);
        this.update(this.clock.getDelta(), this.inputs, this.renderer);
      };
      update();
    }

  }

  update(dt, inputs, renderer) {

    if (this.previousXR !== renderer.xr.isPresenting) {
      this.updateDevice();
      this.previousXR = renderer.xr.isPresenting;
    }

    this.updateCamera(dt, inputs, this.camera);

    if (this.inputs.xr) {
      const matrix = this.tempMatrix.identity().extractRotation(this.controllerRight.matrix);
      const orientation = new THREE.Vector3(0, 0, -1).applyMatrix4(matrix);
      this.raycaster.set(this.controllerRight.position, orientation);

    } else {
      this.raycaster.setFromCamera(inputs.mousePosition, this.camera);
    }

    if (this.sceneBackground) {
      this.sceneBackground.root.position.copy(this.userPosition).negate();
      this.sceneBackground.update(dt, inputs, this.camera);
      this.checkCrossing();
    }
    if (this.opened) {
      this.morphPortal -= dt;
      if (this.morphPortal < 0) this.morphPortal = 0;
    } else {
      this.morphPortal += dt;
      if (this.morphPortal > 1) this.morphPortal = 1;
    }
    this.meshDoor.morphTargetInfluences[0] = this.morphPortal;
    this.meshWall.morphTargetInfluences[0] = this.morphPortal;
    document.body.style.cursor = 'default';

    this.rootDoor.position.copy(this.userPosition).negate();
    this.rootWall.position.copy(this.userPosition).negate();

    this.sceneForeground.root.position.copy(this.userPosition).negate();
    this.sceneForeground.update(dt, inputs, this.camera, this.raycaster);

    if(this.multiVisitor) {
      this.multiVisitor.updateUser(dt, inputs, this.camera, this.userPosition, this.sceneFrontIndex);
    }

    ThreeMeshUI.update();
  }

  updateCamera(dt, inputs, camera) {

    const previousPos = camera.position.clone();
    if (inputs.xr) {
      if (inputs.controllerRightButton2) {
        const speed = 2;
        const vector = new THREE.Vector3();
        this.inputs.controllerRight.getWorldDirection(vector);
        vector.negate();
        vector.y = 0;
        vector.multiplyScalar(speed * dt);
        this.userPosition.add(vector);
      }
    } else {
      const portailFactor = inputs.mo ? -(Math.max(-0.625 * this.distancePortail + 1.25, 0)) : 0;
      const node = store.universes[store.indexUniverse].nodes[store.indexNode];
      const camTarget = node.camTarget[store.device].clone();
      const camOrigin = node.camOrigin[store.device].clone();
      camOrigin.y += portailFactor * 2;
      let dxt = (camTarget.x - this.cameraTarget.x);
      let dyt = (camTarget.y - this.cameraTarget.y);
      let dzt = (camTarget.z - this.cameraTarget.z);
      let dxo = (camOrigin.x - camera.position.x);
      let dyo = (camOrigin.y - camera.position.y);
      let dzo = (camOrigin.z - camera.position.z);
      const speed = 1.5;
   
      camera.position.x += dxo * dt * speed;
      camera.position.y += dyo * dt * speed;
      camera.position.z += dzo * dt * speed;
      this.cameraTarget.x += dxt * dt * speed;
      this.cameraTarget.y += dyt * dt * speed;
      this.cameraTarget.z += dzt * dt * speed;
      camera.lookAt(this.cameraTarget);
    }

    let distance = previousPos.distanceTo(this.camera.position);
    if (distance < 0.001) distance = 0;
    this.camera.userData.speed = distance / dt;
    this.camera.userData.direction.copy(previousPos).negate().add(this.camera.position);
  }

  checkCrossing() {
    if (this.morphPortal < 0.2) {//The portal must be half open.
      const camera = this.camera;
      this.meshDoor.getWorldDirection(this.portailDirection);//The portal direction
      this.meshDoor.getWorldPosition(this.portailPosition);


      const userVector = this.portailPosition.clone().negate().add(camera.position); //vector between camera ans portal
      userVector.y = 0;


      const angle = userVector.angleTo(this.portailDirection);

      this.distancePortail = this.portailPosition.distanceTo(camera.position.clone().setY(0));

      if (angle > Math.PI / 2 && this.distancePortail < 0.76) { //camera is behind the gate and through the door and camera walked through the door.(0.76 gate size/2)
        //switch
        const sceneForeground = this.sceneForeground;
        const sceneFrontIndex = this.sceneForeground.index;
        this.sceneForeground = this.sceneBackground;
        this.sceneFrontIndex = this.sceneBackIndex;
        this.sceneBackground = sceneForeground;
        this.sceneBackIndex = sceneFrontIndex;
        this.meshDoor.rotation.y = this.portailDirection.z > 0 ? Math.PI : 0;
        this.meshWall.rotation.y = this.portailDirection.z > 0 ? Math.PI : 0;
        this.sceneForeground.currentWord = true;
        this.sceneBackground.currentWord = false;
        if (this.sceneForeground.afterComing) {
          this.sceneForeground.afterComing();
        }
      }
    }
  }

  render(renderer) {
    renderer.autoClear = false;
    renderer.clear();
    const camera = this.camera;
    if (this.sceneBackground) {
      renderer.render(this.sceneWall, camera);

      this.camera.near = Math.max(0.1, (this.meshDoor.position.distanceTo(camera.position) - 2));
      this.camera.updateProjectionMatrix();

      renderer.render(this.sceneBackground, camera);

      renderer.clearDepth();

      this.camera.near = 0.01;
      this.camera.updateProjectionMatrix();

      renderer.render(this.sceneDoor, camera);
      renderer.render(this.sceneForeground, camera);
    } else {
      renderer.render(this.sceneForeground, camera);
    }
  }

  setUniverse(indexUniverse, universe) {
    this.universes[indexUniverse] = universe;

  }

  async initUniverse(sceneFrontIndex, sceneBackIndex) {
    this.sceneFrontIndex = sceneFrontIndex;
    this.sceneForeground = this.universes[sceneFrontIndex];
    this.sceneForeground.currentWord = true;
    if (!this.sceneForeground.initialised) {
      await this.sceneForeground._init(sceneFrontIndex, this.camera);
      this.sceneForeground.onOpenUniverse(this.openUniverse.bind(this));
      this.sceneForeground.onCloseUniverse(this.closeUniverse.bind(this));
      this.sceneForeground.onJumpUniverse(this.jumpUniverse.bind(this));
    }
    if (sceneBackIndex) {
      this.sceneBackground = this.universes[sceneBackIndex];
      this.sceneBackIndex = sceneBackIndex;
      if (!this.sceneBackground.initialised) {
        await this.sceneBackground._init(sceneBackIndex, this.camera);
        this.sceneBackground.onOpenUniverse(this.openUniverse.bind(this));
        this.sceneBackground.onCloseUniverse(this.closeUniverse.bind(this));
        this.sceneBackground.onJumpUniverse(this.jumpUniverse.bind(this));
      }
      this.sceneBackground.currentWord = false;
    } else {
      this.sceneBackground = null;
      this.sceneBackIndex = '';
    }
    this.sceneForeground.refreshSceneState(store.device);
    if(this.sceneBackground) {
      this.sceneBackground.refreshSceneState(store.device);
    }
  }

  async openUniverse(indexUniverse, portalPos) {
    if (this.sceneBackIndex === indexUniverse) return;
    const camera = this.camera;
    const vector = new THREE.Vector3();
    camera.getWorldDirection(vector);
    this.meshWall.position.copy(portalPos);
    this.meshDoor.position.copy(portalPos);
    this.meshWall.rotation.y = vector.z > 0 ? Math.PI : 0;
    this.meshDoor.rotation.y = vector.z > 0 ? Math.PI : 0;
    this.morphPortal = 1;
    this.opened = true;
    clearTimeout(this.tempoClose);
    await this.initUniverse(this.sceneFrontIndex, indexUniverse);
  }

  async closeUniverse() {
    this.morphPortal = 0;
    if (!this.sceneBackground) return;
    this.opened = false;
    clearTimeout(this.tempoClose);
    this.tempoClose = setTimeout(async () => {
      if (this.sceneBackground && this.sceneBackground.onClosed) {
        this.sceneBackground.onClosed();
      }
      await this.initUniverse(this.sceneFrontIndex);
    }, 1000);
  }
  dismount() {
    clearTimeout(this.tempoClose);
    this.removeWindowEvents();
    this.removeVREvents();
    cancelAnimationFrame(this.requestAnimation);
  }

  async jumpUniverse(indexUniverse) {
    this.userPosition.x = 0;
    this.userPosition.z = 0;
    this.opened = false;
    this.morphPortal = 1;
    await this.initUniverse(indexUniverse);
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    if (this.composer) {
      this.composer.setSize(window.innerWidth, window.innerHeight);
    } else {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    this.updateDevice();
  }

  updateDevice() {
    this.inputs.xr = this.renderer.xr.isPresenting;
    this.inputs.mo = false;
    if (this.inputs.xr) {
      store.device = 'vr';
      if(this.previousXR !== this.renderer.xr.isPresenting) { //it is also called for opening a universe
        this.userPosition.copy(this.userPositionSave); //Do only if you just turned on VR mode.
      }
    } else if (window.innerWidth / window.innerHeight > 1) {
      store.device = 'pc';
      this.userPositionSave.copy(this.userPosition); 
      this.userPosition.set(0,0,0);
    } else {
      store.device = 'mo';
      this.inputs.mo = true;
      this.userPositionSave.copy(this.userPosition);
      this.userPosition.set(0,0,0);
    }
    store.ratio = window.innerWidth / window.innerHeight;


    if (this.sceneForeground) { 
      this.sceneForeground.refreshSceneState(store.device);
      this.sceneForeground.onDeviceChange(store.device);
    }
    if (this.sceneBackground) {
      this.sceneBackground.refreshSceneState(store.device);
      this.sceneBackground.onDeviceChange(store.device);
    }
  }

  syncMultiVR() {
    if(!this.multiVisitor) {
      this.multiVisitor = new MultiVisitor();
      this.multiVisitor.init(this.universes);
    }
  }

  selectstartLeft() {
    this.inputs.controllerLeftButton1 = true;
    if (this.onPressControllerLeft1) {
      this.onPressControllerLeft1();
    }
  }

  selectendLeft() {
    this.inputs.controllerLeftButton1 = false;
    if (this.onReleaseControllerLeft1) {
      this.onReleaseControllerLeft1();
    }
  }

  squeezestartLeft() {
    this.inputs.controllerLeftButton2 = true;
    if (this.onPressControllerLeft2) {
      this.onPressControllerLeft2();
    }
  }

  squeezeendLeft() {
    this.inputs.controllerLeftButton2 = false;
    if (this.onReleaseControllerLeft2) {
      this.onReleaseControllerLeft2();
    }
  }

  selectstartRight() {
    this.inputs.controllerRightButton1 = true;
    if (this.onPressControllerRight1) {
      this.onPressControllerRight1();
    }
  }

  selectendRight() {
    this.inputs.controllerRightButton1 = false;
    if (this.onReleaseControllerRight1) {
      this.onReleaseControllerRight1();
    }
  }

  squeezestartRight() {
    this.inputs.controllerRightButton2 = true;
    if (this.onPressControllerRight2) {
      this.onPressControllerRight2();
    }
  }

  squeezeendRight() {
    this.inputs.controllerRightButton2 = false;
    if (this.onReleaseControllerRight2) {
      this.onReleaseControllerRight2();
    }
  }

  pointermove(event) {
    this.inputs.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.inputs.mousePosition.y = - (event.clientY / window.innerHeight) * 2 + 1;
    if (this.onMouseMove) {
      this.onMouseMove(this.inputs.mousePosition);
    }
  }

  pointerdown() {
    this.inputs.mouseButton = true;
  }

  pointerup(event) {
    const pointer = new THREE.Vector2();
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
    this.inputs.mouseButton = false;
    if (this.onClick) {
      this.onClick(pointer);
    }
  }

  touchstart(event) {
    this.inputs.mouseButton = true;
    this.inputs.mousePosition.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
    this.inputs.mousePosition.y = - (event.touches[0].clientY / window.innerHeight) * 2 + 1;
  }

  touchend() {
    this.inputs.mouseButton = false;
    this.inputs.mousePosition.x = 1;
    this.inputs.mousePosition.y = 1;
  }

  wheel(event) {
    if (this.onWheel) {
      this.onWheel(event);
    }
  }

}

export default Metaverse;