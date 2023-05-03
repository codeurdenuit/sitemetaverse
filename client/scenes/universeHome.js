import * as THREE from 'three';
import Scene from '../components/scene';
import Sky from '../components/sky';
import Moon from '../components/moon';
import Laser from '../components/laser';
import PanelHome from '../components/panelHome';
import Room from '../components/room';
import Character from '../components/character';
import Cat from '../components/cat';
import HomeTitle from '../components/homeTitle';
import Area from '../components/area';
import materialLineGradiant from '../materials/materialLineGradiant';



import store from '../store';

export default class UniverseHome extends Scene {

  async init(camera) {

    this.camera = camera;

    this.lightAmbient = new THREE.AmbientLight(0x404050);
    this.add(this.lightAmbient);

    this.light = new THREE.PointLight(0xffffff);
    this.light.intensity = 2;
    this.light.distance = 4;
    this.add(this.light);

    this.character = new Character();
    this.root.add(this.character);

    this.cat = new Cat();

    this.root.add(this.cat);
    this.cat.playAnimation();

    this.title = new HomeTitle();
    this.root.add(this.title);

    this.meshTree = store.getObject3D('tree').clone();
    this.meshTree.material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.root.add(this.meshTree);

    this.area = new Area();
    this.root.add(this.area);

    this.sky = new Sky(300, 200);
    this.add(this.sky);
    this.root.add(this.sky.dynamicLayout);

    this.moon = new Moon();
    this.add(this.moon);

    this.materialLineGradiant = materialLineGradiant;

    this.laser = new Laser();
    this.add(this.laser);

    const sceneStore = store.universes[this.index].scene;
    this.rooms = [];
    const rooms = sceneStore.rooms;
    const nodes = store.universes[this.index].nodes;
    for (let i = 0; i < rooms.length; i++) {
      const params = rooms[i];
      const currentNode = nodes[i + 1];
      const room = new Room(params);
      this.rooms.push(room);
      this.root.add(room);
      room.disable();
      room.onClickIcon(() => {
        if (room.display) {
          store.indexNode = params.indexNode - 1;
          this.closeUniverse();
          if(room.indexNode===1) {
            const footer = document.getElementById('nowebgl');
            if(footer) footer.className='show'
          }
        } else {
          store.indexNode = params.indexNode;
          this.closeUniverse();
          if(room.indexNode===1) {
            const footer = document.getElementById('nowebgl');
            if(footer) footer.className='hide'
          }
        }
        this.panelInfo.hide();
      });
      room.onShow(() => {
        this.character.playAnimation(params.anim, params.position[store.device]);
      });
      room.onHide(() => {
        this.character.stopAnimation();
        this.restartNearestAnimation();
      });
      if (i === 0) {
        room.onClickPanel(() => {
          this.panelInfo.show(100);
          store.goTo(0, 5);
        });
      } else {
        room.onClickPanel(() => {
          if (room.opened) {
            this.closeUniverse();
            room.scriptOpenUnivers(store);
          } else {
            room.scriptOpenUniverse(store);
            this.openUniverse(currentNode.portalUniverse, currentNode.portalPos[store.device]);
          }
        });
      }

      this.distanceDisplay = 4;
      this.vectorTemp = new THREE.Vector3();
    }

    this.panelInfo = new PanelHome(sceneStore.infoTitle, sceneStore.infoText);
    this.panelInfo.rotateY(-Math.PI / 2);
    this.root.add(this.panelInfo);
    this.panelInfo.onBack(() => {
      this.panelInfo.hide();
      store.goTo(0, 1);
    });

    this.title.onStart(() => {
      this.rooms[0].enable();
      setTimeout(() => {
        this.rooms[1].enable();
      }, 100);
      setTimeout(() => {
        this.rooms[2].enable();
      }, 200);
    });
  }

  afterComing() {
    setTimeout(() => {
      this.closeUniverse();
      for (let i = 0; i < this.rooms.length; i++) {
        this.rooms[i].showText();
      }
    }, 1000);
  }

  onClosed() {
    for (let i = 0; i < this.rooms.length; i++) {
      this.rooms[i].reset();
    }
    this.character.stopAnimation();
  }

  update(dt, inputs, camera, raycaster) {

    this.moon.lookAt(camera.position);
    this.sky.update(dt);
    this.cat.update(dt);
    this.title.update(dt, inputs, raycaster);
    this.area.update(camera);
    this.laser.update(inputs);
    this.character.update(dt);
    this.light.position.copy(camera.position);
    this.light.position.x -=1;
    this.light.position.y +=2;
    this.light.position.z -=1;

    if (this.title.display) return;

    if (this.currentWord) {
      this.panelInfo.update(dt, raycaster, inputs);
      for (let i = 0; i < this.rooms.length; i++) {
        this.rooms[i].update(dt, raycaster, inputs, camera);
      }
      const scene = store.universes[this.index].scene;
      
      const offsetTrigger = camera.userData.direction.z > 0 ? scene.offsetTriggerForward[store.device] : scene.offsetTriggerBackward[store.device];

      for (let i = 0; i < this.rooms.length; i++) {
        this.rooms[i].getWorldPosition(this.vectorTemp);
        this.vectorTemp.z += offsetTrigger;
        const distance = this.vectorTemp.z - camera.position.z;

        if (distance > -this.distanceDisplay) {
          this.rooms[i].show();
        } else {
          this.rooms[i].hide();
        }

        if (i === 3) {
          if (!this.rooms[i].enabled && distance > -10) {
            this.rooms[i].enable();
          }
        }
      }
    }
  }

  restartNearestAnimation() {
    const rooms = store.universes[this.index].scene.rooms;
    for (let i = 0; i < this.rooms.length; i++) {
      this.rooms[i].getWorldPosition(this.vectorTemp);
      const distance = this.vectorTemp.z - this.camera.position.z;
      if (Math.abs(distance) < 8) {
        this.character.playAnimation(rooms[i].anim, rooms[i].position[store.device]);
      }
    }
  }

  onDeviceChange(device) {
    const sceneStore = store.universes[this.index].scene;
    if(store.indexNode > 0) {
      const currentRoomParam = sceneStore.rooms[store.indexNode-1];
      if(currentRoomParam) {
        this.character.position.copy(currentRoomParam.position[device]);
      }
    }
    this.character.stopAnimation();
    this.restartNearestAnimation();
  }

  refreshSceneState(device) {
    const sceneStore = store.universes[this.index].scene;
    const roomsStore = sceneStore.rooms;
    this.cat.position.copy(sceneStore.catPos[store.device]);
    this.title.position.copy(sceneStore.titlePos[store.device]);
    this.meshTree.position.copy(sceneStore.treePos[store.device]);
    this.area.position.copy(sceneStore.areaPos[store.device]);
    this.sky.position.copy(sceneStore.skyPos[store.device]);
    this.moon.position.copy(sceneStore.moonPos[store.device]);
    this.title.description.visible = sceneStore.descriptionVisible[store.device];
    this.panelInfo.position.copy(sceneStore.infoPosition[store.device]);
    this.panelInfo.back.position.copy(sceneStore.infoBackPosition[store.device]);
    if(device === 'vr') {
      this.add(this.laser);
      this.remove(this.light);
    }else{
      this.remove(this.laser);
      this.add(this.light);
    }

    for (let i = 0; i < this.rooms.length; i++) {
      this.rooms[i].redraw(roomsStore[i].position[store.device], roomsStore[i].panelPos[store.device], !roomsStore[i].vrOnly||device==='vr' );
    }

  }
}
