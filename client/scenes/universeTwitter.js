import * as THREE from 'three';
import Scene from '../components/scene';
import Icon from '../components/icon';
import Laser from '../components/laser';
import PanelTweet from '../components/panelTweet';
import store from '../store';

export default class UniverseTwitter extends Scene {

  async init() {

    this.light1 = new THREE.PointLight(0xffffff);
    this.light1.position.set(0 + 0, 6, -34);
    this.light1.intensity = 1;
    this.light1.distance = 25;
    this.root.add(this.light1);

    this.light2 = new THREE.PointLight(0xffffff);
    this.light2.position.set(0 - 0.3, -2, -34.3);
    this.light2.intensity = 1;
    this.light2.distance = 28;
    this.root.add(this.light2);

    this.lightAmbient = new THREE.AmbientLight(0xffffff);

    this.meshRoom = store.getObject3D('twitterRoom');
    this.meshRoom.material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: store.getTexture('textureColor') });
    this.root.add(this.meshRoom);

    this.meshSky = new THREE.Mesh(new THREE.BoxGeometry(600, 600, 600), new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide }));
    this.add(this.meshSky);

    this.iconBack = new Icon('icon-back', undefined, 0x000000);
    this.iconBack.rotation.z = -Math.PI / 2;
    this.iconBack.rotation.x = -Math.PI / 2;
    this.iconBack.toScreen(0.43, -0.5);
    this.iconBack.onClick(() => {
      if (store.indexNode === 6) {
        store.indexNode = 3;
        store.indexUniverse = 0;
      }
    });
    this.root.add(this.iconBack);


    this.iconPrevious = new Icon('icon-previous', undefined, 0x000000);
    this.iconPrevious.rotation.z = -Math.PI / 2;
    this.iconPrevious.rotation.x = -Math.PI / 2;
    this.iconPrevious.toScreen(0.43, -0.5);
    this.iconPrevious.onClick(() => {
      if (store.indexNode < 6) {
        store.indexNode = 6;
        this.iconBack.tempoClickValue = 1.5;
      }
    });
    this.root.add(this.iconPrevious);

    this.iconNext = new Icon('icon-next', undefined, 0x000000);
    this.iconNext.rotation.z = -Math.PI / 2;
    this.iconNext.rotation.x = -Math.PI / 2;
    this.iconNext.toScreen(0.43, -0.5);
    this.iconNext.onClick(() => {
      if (store.indexNode > 6) {
        store.indexNode = 6;
        this.iconBack.tempoClickValue = 1.5;
      }
    });
    this.root.add(this.iconNext);


    this.panels = [];

    const nodes = store.universes[this.index].nodes;
    fetch(store.apiHost + '/api/twitter', { method: 'GET' }).then(async response => {
      const tweets = await response.json();
      const angleStep = Math.PI / 9;
      const angleRange = angleStep * tweets.length;
      const angleStart = Math.PI / 2 - angleRange / 2;
      for (let i = 0; i < tweets.length; i++) {
        const camTarget = nodes[i].camTarget[store.device];
        const tweet = tweets[i];
        const panel = new PanelTweet(tweet.text, tweet.created_at, tweet.thumbnail);

        panel.position.set(camTarget.x, i + 2, camTarget.z);
        panel.rotation.y = angleStep * i + angleStart - Math.PI / 2;

        this.root.add(panel);
        this.panels.push(panel);

        panel.onClick(() => {
          if (store.indexNode === i && panel.link) {
            location.href = panel.link;
          }
          store.indexNode = i;
        });
      }
    });

    this.laser = new Laser();
    this.add(this.laser);
    this.topPanel = 0.45;
  }


  onClosed() {
    for (let i = 0; i < this.panels.length; i++) {
      this.panels[i].position.y = i + 2;
    }
  }

  update(dt, inputs, camera, raycaster) {

    if (this.currentWord) {
      if (!inputs.xr) {
        this.iconBack.update(dt, raycaster, inputs, camera);
        this.iconPrevious.update(dt, raycaster, inputs, camera);
        this.iconNext.update(dt, raycaster, inputs, camera);
        const indexNode = store.indexNode;
        this.iconPrevious.visible = indexNode < 6;
        this.iconNext.visible = indexNode > 6;
        this.iconBack.visible = indexNode === 6
      }
    } else {
      this.iconBack.visible = false;
      this.iconPrevious.visible = false;
      this.iconNext.visible = false;
    }

    for (let i = 0; i < this.panels.length; i++) {
      const panel = this.panels[i];
      panel.update(dt, raycaster, inputs, this.currentWord);
      if (panel.tempoClick > 0.5) break;
      if (panel.position.y > 0.45) {
        panel.position.y -= Math.min(dt * panel.position.y * 3, 0.1);
        if (panel.position.y < 0.45) {
          panel.position.y = 0.45;
        }
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
      if (panel.position.y > this.topPanel) {
        panel.position.y -= Math.min(dt * panel.position.y * 3, 0.1);
        if (panel.position.y < this.topPanel) {
          panel.position.y = this.topPanel;
        }
      }
    }
  }

  refreshSceneState(device) {
    const sceneStore = store.universes[this.index].scene;
    this.meshRoom.position.copy(sceneStore.area[device]);

    if (sceneStore.buttonVisible[device]) {
      const indexNode = store.indexNode;
      this.iconPrevious.visible = indexNode < 6;
      this.iconNext.visible = indexNode > 6;
      this.iconBack.visible = indexNode === 6
    }
    const nodes = store.universes[this.index].nodes;
    for (let i = 0; i < this.panels.length; i++) {
      const camTarget = nodes[i].camTarget[device];
      const panel = this.panels[i];
      panel.position.x = camTarget.x;
      panel.position.z = camTarget.z;
      panel.rotation.y = sceneStore.angleStep * i + sceneStore.angleStart - Math.PI / 2;
      panel.container.frame.material.side = THREE.DoubleSide;
    }
  }
}
