import * as THREE from 'three';
import Scene from '../components/scene';
import Icon from '../components/icon';
import Title from '../components/title';
import Laser from '../components/laser';
import PanelVideo from '../components/panelVideo';
import store from '../store';
export default class UniverseYoutube extends Scene {

  async init() {

    this.lightAmbient = new THREE.AmbientLight(0x404050);
    this.add(this.lightAmbient);

    this.light = new THREE.PointLight(0xffffff);
    this.light.intensity = 2;
    this.light.distance = 4;
    this.add(this.light);

    const unity = 3;
    const width = 120;
    const depth = 120;
    const height = 30;

    const shadow = store.getObject3D('shadowPanel');
    shadow.material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: store.getTexture('textureColor') });

    this.meshLogo = store.getObject3D('logo').clone();
    this.meshLogo.material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: store.getTexture('textureColor') });
    this.meshLogo.scale.multiplyScalar(3.4);
    this.meshLogo.rotation.x = Math.PI / 2;
    this.root.add(this.meshLogo);


    this.meshBox = new THREE.Mesh(
      new THREE.BoxGeometry(width + .04, height + .04, depth + .04).translate(unity / 2, height / 2, unity / 2),
      new THREE.MeshBasicMaterial({ color: 0xeeeeee, side: THREE.BackSide })
    );
    this.root.add(this.meshBox);

    this.title = new Title('Chaîne Codeur de Nuit', 0.7, new THREE.Color(0x111111));
    this.root.add(this.title);
    this.title.scale.set(6, 6, 6);
    const shadowTitle = shadow.clone();
    shadowTitle.position.set(-0.25, -0.33, 0);
    shadowTitle.scale.multiplyScalar(3);
    this.title.add(shadowTitle);

    this.iconBack = new Icon('icon-back', undefined, 0x000001);
    this.iconBack.rotation.z = -Math.PI / 2;
    this.iconBack.rotation.x = -Math.PI / 2;
    this.iconBack.toScreen(0.43, -0.5);
    this.iconBack.onClick(() => {
      const currentNode = store.universes[store.indexUniverse].nodes[store.indexNode];
      store.indexUniverse = currentNode.portalUniverse;
      store.indexNode = currentNode.portalNode;
      for (let i = 0; i < this.panels.length; i++) {
        this.panels[i].pause();
      }
    });
    this.root.add(this.iconBack);


    this.iconPrevious = new Icon('icon-next', undefined, 0x000001);
    this.iconPrevious.rotation.z = -Math.PI / 2;
    this.iconPrevious.rotation.x = -Math.PI / 2;
    this.iconPrevious.toScreen(0.43, -0.5);
    this.iconPrevious.onClick(() => {
      if (store.indexNode != 0) {
        store.indexNode=0;
        this.iconBack.visible = true;
        this.iconPrevious.visible = false;
      }
    });
    this.root.add(this.iconPrevious);



    this.panels = [];
    fetch(store.apiHost + '/api/youtube', { method: 'GET' }).then(async response => {
      const videos = await response.json();
      for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        const panel = new PanelVideo(video.title, video.description, video.video, video.link, video.thumbnail, shadow.clone());
        panel.position.set(0 + i * -3, i + 8, -27.5);
        this.root.add(panel);
        this.panels.push(panel);
        panel.onClick(() => {
          store.indexNode = i;
        });
      }
      this.onDeviceChange(store.device);
    });

    this.laser = new Laser();
    this.add(this.laser);
  }

  onClosed() {
    for (let i = 0; i < this.panels.length; i++) {
      this.panels[i].position.y = i + 8;
    }
  }

  update(dt, inputs, camera, raycaster) {

    if (this.currentWord) {
      if (!inputs.xr) {
        if(this.iconBack.visible)
        this.iconBack.update(dt, raycaster, inputs, camera);
        if(this.iconPrevious.visible)
        this.iconPrevious.update(dt, raycaster, inputs, camera);
        this.light.position.copy(camera.position);
        this.light.position.x -=1;
        this.light.position.y +=2;
        this.light.position.z -=1;
      }
      const minz = inputs.mo ? 5 : 3;
      for (let i = 0; i < this.panels.length; i++) {
        const panel = this.panels[i];
        const position = new THREE.Vector3();
        panel.getWorldPosition(position);

        if (camera.userData.speed < 6.0 && store.indexUniverse === this.index) {
          if (!inputs.xr) {
            const dx = Math.abs((position.x + (inputs.mo ? 3 : 1)) - camera.position.x);
            const dz = Math.abs(position.z - camera.position.z);
            if (dx < 1.2 && dz < minz) {
              panel.play();
              this.iconBack.visible = i===0;
              this.iconPrevious.visible = i!==0;
            } else {
              panel.pause();
            }
          } else {
            const dx = Math.abs(position.x - camera.position.x);
            const dz = Math.abs(position.z - camera.position.z);
            if (dx < 1.2 && dz < 4) {
              panel.play();
            } else {
              panel.pause();
            }
          }
          panel.update(dt, raycaster, inputs);
        }
      }
    } else {
      this.iconBack.visible = false;
      this.iconPrevious.visible = false;
      for (let i = 0; i < this.panels.length; i++) {
        const panel = this.panels[i];
        panel.update(dt, null, inputs);
      }
    }
    if (inputs.xr) {
      this.laser.update(inputs);
    }

    this.fadeinAnimation(dt);
   
  }

  fadeinAnimation(dt) {
    for (let i = 0; i < this.panels.length; i++) {
      const panel = this.panels[i];
      if (panel.position.y > 0) {
        panel.position.y -= Math.min(dt * panel.position.y * 3, 0.1);
        if (panel.position.y < 0) {
          panel.position.y = 0;
        }
      }
    }
  }

  refreshSceneState(device) {
    const sceneStore = store.universes[this.index].scene;
    this.title.position.copy(sceneStore.title[device]);
    this.meshBox.position.copy(sceneStore.area[device]);
    this.meshLogo.position.copy(sceneStore.logo[device]);
    this.iconBack.visible = sceneStore.backVisible[device];
    if(device === 'vr') {
      this.add(this.laser);
    }else{
      this.remove(this.laser);
    }
  }

}
