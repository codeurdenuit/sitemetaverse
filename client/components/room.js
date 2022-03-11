import * as THREE from 'three';
import PanelHome from './panelHome';
import Icon from '../components/icon';
import Link from '../components/link';
import store from '../store';
const halfpi = Math.PI / 2;
const mo = 'mo';

class Room extends THREE.Object3D {

  constructor(params) {
    super();

    const textureColor = store.getTexture('textureColor');
    const textureLight = store.getTexture('textureLight');

    const meshRoom = store.getObject3D(params.mesh);
    const light = meshRoom.getObjectByName(`${params.mesh}-light`);

    const materialRoom = new THREE.MeshPhongMaterial({ map: textureColor, shininess: 0, emissiveMap: textureLight });

    this.meshIcon = new Icon(params.icon, params.iconColor, params.colorShape);
    this.meshRoom = meshRoom;
    this.light = light;
    this.light.intensity = params.lightIntensity;
    this.light.distance = params.lightDistance;
    this.light.decay = 2;
    this.distanceMin = 9;
    this.distanceMax = 7;
    this.progress = 0;
    this.progressIcon = 0;
    this.display = false;
    this.enabled = false;
    this.links = [];
    this.composition = [];
    this.randomPosition = [];
    this.opened = false;
    this.animCharacter = params.anim;
    this.indexNode = params.indexNode;
    this.raycaster = new THREE.Raycaster();
    this.panel = new PanelHome(params.title, params.text, params.button);

    this.add(this.meshRoom);
    this.add(this.panel);
    this.add(this.meshIcon);

    this.meshIcon.position.set(0, 1, 0);
    this.meshIcon.rotation.set(0, -halfpi, 0);
    this.meshIcon.saveState();
    this.meshRoom.position.set(0, 0, 0);

    this.computeComposingAnim(materialRoom);
    this.computeLinks(params);
    this.animation(0);
  }

  redraw(position, panelPos, buttonDisplayed) {
    this.position.copy(position);
    this.panel.position.copy(panelPos);
    this.panel.button.visible = buttonDisplayed;
    if(this.meshIcon.screened) {
      const spacingIcon = store.device === mo ? 0.28 : 0.08;
      this.meshIcon.screenPosition.set(0.43 - (this.indexNode - 1) * spacingIcon, -0.5 );
    }
  }

  computeComposingAnim(materialRoom) {
    for (let i = 0; i < this.meshRoom.children.length; i++) {
      if (this.meshRoom.children[i].type === 'Mesh') {
        this.meshRoom.children[i].visible = false;
        this.composition.push(this.meshRoom.children[i]);
        const randpos = new THREE.Vector3();
        randpos.x = (Math.random() - 0.5) * 5;
        randpos.z = (Math.random() - 0.5) * 5;
        this.randomPosition.push(randpos);
        this.meshRoom.children[i].material = materialRoom;
      }
    }
  }

  computeLinks(params) {
    if (!params.links) return;
    for (let i = 0; i < params.links.length; i++) {

      const text = params.links[i].text;
      const url = params.links[i].url;
      const link = new Link(text, url, params.position.pc);
      link.rotateY(params.position.pc.x > 0 ? -Math.PI / 2 : Math.PI / 2);
      link.position.x = params.position.pc.x > 0 ? 1.39 : -1.39;
      link.position.z = 0.2;
      link.position.y = 2.18 - i * 0.25;
      this.add(link);
      this.links.push(link);
      link.visible = false;
    }
  }

  show() {
    if (!this.display) {
      this.display = true;
      this.animating = true;
      this.cbshowed = false;
      this.panel.show(700);
      const spacingIcon = store.device === mo ? 0.28 : 0.08;
      this.meshIcon.startAnimationScreen(0.43 - (this.indexNode - 1) * spacingIcon, -0.5);
      if (this.cbBeforeShow)
        this.cbBeforeShow();
    }
  }

  hide() {
    if (this.display) {
      this.display = false;
      this.animating = true;
      this.cbshowed = false;
      this.showText();
      this.hideLinks();
      this.panel.hide(300);
      this.meshIcon.startAnimationUnscreen();
      if (this.cbBeforeHide)
        this.cbBeforeHide();
    }
  }

  reset() {
    this.display = false;
    this.showText();
    this.panel.reset();
    this.progress = 0;
    this.progressIcon = 0;
    this.cbshowed = false;
    this.animating = false;
    this.meshIcon.init();
    for (let i = 0; i < this.composition.length; i++) {
      this.composition[i].visible = false;
    }
  }

  disable() {
    this.meshIcon.visible = false;

  }

  enable() {
    this.enabled = true;
    this.meshIcon.visible = true;
    this.meshIcon.startAnimationEnter();
  }

  update(dt, raycaster, inputs, camera) {
    if (this.enabled) {
      this.animation(dt);
      this.meshIcon.update(dt, raycaster, inputs, camera);
      this.panel.update(dt, raycaster, inputs);
      for (let i = 0; i < this.links.length; i++) {
        this.links[i].update(raycaster, inputs);
      }
    }
  }

  animation(dt) {
    if (this.animating) {
      if (this.display) {
        this.progress += dt;
        if (this.progress > 0.5 && !this.cbshowed) {
          if (this.cbShow)
            this.cbShow();
          this.showLinks();
          this.cbshowed = true;
        }
        if (this.progress > 1) {
          this.progress = 1;
          this.animating = false;
        }
      } else {
        this.progress -= dt;
        if (this.progress < 0.6 && !this.cbshowed) {
          if (this.cbHide)
            this.cbHide();
          this.cbshowed = true;
        }
        if (this.progress < 0) {
          this.progress = 0;
          this.animating = false;
        }
      }
      const targetPosition = new THREE.Vector3();
      const step = 0.5 / this.composition.length;
      for (let i = 0; i < this.composition.length; i++) {
        let progresTempo = this.progress * 2 - i * step;
        progresTempo = Math.max(0, progresTempo);
        progresTempo = Math.min(1, progresTempo);
        this.composition[i].position.lerpVectors(targetPosition, this.randomPosition[i], 1 - progresTempo);
        this.composition[i].position.y = 10 - 10 * progresTempo;
        this.composition[i].visible = progresTempo > 0;
      }
    }
  }

  onClickIcon(cb) {
    this.meshIcon.onClick(cb);
  }

  onBack(cb) {
    this.panel.onBack(cb);
  }

  onClickPanel(cb) {
    this.panel.onClick(cb);
  }

  onShow(cb) {
    this.cbShow = cb;
  }

  onBeforeShow(cb) {
    this.cbBeforeShow = cb;
  }

  onHide(cb) {
    this.cbHide = cb;
  }

  onBeforeHide(cb) {
    this.cbBeforeHide = cb;
  }

  hideText() {
    if (!this.opened) {
      this.panel.hideText();
    }
    this.opened = true;
  }

  showText() {
    if (this.opened) {
      this.panel.showText();
    }
    this.opened = false;
  }

  showLinks() {
    for (let i = 0; i < this.links.length; i++) {
      this.links[i].visible = true;
    }
  }

  hideLinks() {
    for (let i = 0; i < this.links.length; i++) {
      this.links[i].visible = false;
    }
  }

  scriptOpenUniverse(store) {
    const currentNode = store.universes[0].nodes[this.indexNode];
    this.hideText();
    setTimeout(() => {
      store.goTo(currentNode.portalUniverse, currentNode.portalNode);
    }, 1000);
  }

  scriptCloseUniverse(store) {
    this.showText();
    store.goTo(0, this.indexNode);
  }
}

export default Room;
