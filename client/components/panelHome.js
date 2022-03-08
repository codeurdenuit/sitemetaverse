import * as THREE from 'three';

import ThreeMeshUI from 'three-mesh-ui';
import FontJSON from '../../public/Roboto-Medium-msdf.json';
import FontImage from '../../public/Roboto-Medium.png';
import Arrow from './arrow';
import Button from './button';

class Panel extends THREE.Object3D {

  constructor(title, text, buttonLabel) {
    super();

    this.opacityTarget = 0;
    this.opacityValue = 0;
    this.opacityButton = 0;
    this.tempo = null;


    const container = new ThreeMeshUI.Block({
      textType: 'MSDF',
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0xcccccc),
      fontOpacity: this.opacityTarget,
      backgroundOpacity: 0,
      backgroundColor: new THREE.Color(0x00cc00),
      alignContent: 'left'
    });

    const contentContainer = new ThreeMeshUI.Block({
      padding: 0.05,
      width: 2.4,
      height: 0.7,
      justifyContent: 'start',
      alignContent: 'left',
      backgroundOpacity: 0,
      backgroundColor: new THREE.Color(0xff0000),
    });

    contentContainer.add(
      new ThreeMeshUI.Text({
        content: text,
        fontSize: 0.10
      })
    );

    this.titleContainer = new ThreeMeshUI.Block({
      width: 2.45,
      height: 0.28,
      padding: 0.03,
      alignContent: 'left',
      backgroundOpacity: 0,
      backgroundColor: new THREE.Color(0x0000ff),
    });

    this.titleContainer.add(
      new ThreeMeshUI.Text({
        content: title,
        fontSize: 0.23
      })
    );

    container.add(this.titleContainer, contentContainer);
    this.add(container);

    if(buttonLabel) {
      this.button = new Button(buttonLabel);
      this.button.opacity = 0;
      this.button.position.y = -0.7;
      this.button.position.x = -0.7;
      container.add(this.button);
    }

    this.container = container;
    this.contentContainer = contentContainer;
  }

  onClick(callback) {
    if (this.button)
      this.button.onClick(callback);
  }

  onBack(callback) {
    this.back = new Arrow(0.1, 0.6, 0.0);
    this.back.material.opacity = 0;
    this.back.rotation.z = -Math.PI / 2;
    this.back.rotation.x = -Math.PI / 2;
    this.add(this.back);
    this.back.onClick(callback);
  }

  show(delay) {
    clearTimeout(this.tempo);
    this.tempo = setTimeout(() => {
      this.opacityTarget = 1;
    }, delay||1000);
  }

  hide() {
    clearTimeout(this.tempo);
    this.opacityTarget = 0;
  }

  reset() {
    this.opacityTarget = 0;
    this.opacityValue = 0;
    this.container.set({
      fontOpacity: this.opacityValue
    });
    this.button.opacity = this.opacityValue;
  }

  showText() {
    this.opacityTarget = 1;
  }

  hideText() {
    this.opacityTarget = 0;
  }

  update(dt, raycaster, inputs) {
    const deltaOpacity = this.opacityTarget - this.opacityValue;
    const deltaOpacityAbs = Math.abs(deltaOpacity);

    if (deltaOpacityAbs > 0.05) {
      this.opacityValue += dt * Math.sign(deltaOpacity) / (Math.max(deltaOpacityAbs, 0.5));
    } else {
      this.opacityValue = this.opacityTarget;
    }




    this.container.set({
      fontOpacity: this.opacityValue
    });


    if (this.button) {
      this.button.opacity = this.opacityValue;
      this.button.update(dt, raycaster, inputs);
    }

    if (!inputs.xr&& this.back) {
      this.back.material.opacity = this.opacityValue;
      if (this.opacityValue > 0) {
        this.back.update(dt, raycaster, inputs);
      }
    }
  }

}

export default Panel;
