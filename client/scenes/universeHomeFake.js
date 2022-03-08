import * as THREE from 'three';
import Scene from '../components/scene';
import Sky from '../components/sky';
import Moon from '../components/moon';
import Area from '../components/area';
import Icon from '../components/icon';



import store from '../store';

export default class UniverseHomeFake extends Scene {

  async init() {


    this.lightAmbient = new THREE.AmbientLight(0x404050);
    this.add(this.lightAmbient);

    const material = new THREE.MeshBasicMaterial({color:0x000000});

    const sceneStore = store.universes[this.index].scene;

    this.meshTree = store.getObject3D('tree').clone();
    this.meshTree.material = material;
    this.meshTree.position.copy(sceneStore.treePos[store.device]);
    this.root.add(this.meshTree);
    

    this.meshCat = store.getObject3D('catBody').clone();
    this.meshCat.material = material;
    this.meshCat.position.copy(sceneStore.catPos[store.device]);
    this.root.add(this.meshCat);

    this.area = new Area();
    this.area.position.copy(sceneStore.areaPos[store.device]);
    this.root.add(this.area);
    
    this.sky = new Sky(300, 200);
    this.add(this.sky);
    this.root.add(this.sky.dynamicLayout);

    this.moon = new Moon();
    this.moon.position.copy(sceneStore.moonPos[store.device]);
    this.add(this.moon);


    const rooms = sceneStore.rooms;
    for (let i = 0; i < rooms.length; i++) {
      const params = rooms[i];
      const meshIcon = new Icon(params.icon, params.iconColor, params.colorShape);
      meshIcon.position.copy(params.position[store.device]);
      meshIcon.rotation.set(0, -Math.PI/2, 0);
      this.root.add(meshIcon);
    }
  }

  afterComing() {
    this.closeUniverse();
    store.indexUniverse = 0;
    store.indexNode = 0;
    this.jumpUniverse(0);
  }

  update(dt, inputs, camera) {
    this.moon.lookAt(camera.position);
    this.sky.update(dt);
    this.area.update(camera);
  }

  onDeviceChange() {

  }
}
