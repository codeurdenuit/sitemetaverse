import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';
import FontJSON from '../../public/Roboto-Medium-msdf.json';
import FontImage from '../../public/Roboto-Medium.png';

class Button extends THREE.Object3D {

  constructor(label) {
    super();

    this.opacity = 0;
    this.tempoClick = 0;
    const container = new ThreeMeshUI.Block({
      textType: 'MSDF',
      fontFamily: FontJSON,
      fontTexture: FontImage,
      width: 1,
      height: 0.2,
      padding: 0.05,
      alignContent: 'center',
      backgroundOpacity: this.opacity,
      fontOpacity: this.opacity,
      fontColor: new THREE.Color(0x000000),
      backgroundColor: new THREE.Color(0xdddddd),
      borderRadius: 0.05,
    });
    container.add(
      new ThreeMeshUI.Text({
        content: label,
        fontSize: 0.1
      })
    );
    container.position.z = 0.01;
    this.add(container);
    this.container = container;
  }

  onFocus() {
    document.body.style.cursor = 'pointer';
    this.container.set({
      backgroundColor: new THREE.Color(0xff44ff),
    });
  }

  onBlur() {
    this.container.set({
      backgroundColor: new THREE.Color(0xffffff),
    });
  }

  onClick(callback) {
    this.click = callback;
  }

  update(dt, raycaster, inputs) {
    this.container.set({
      fontOpacity: this.opacity,
      backgroundOpacity: this.opacity
    });


    if (this.opacity > 0 && raycaster.intersectObject(this.container, true).length) {
      if (inputs.mouseButton || inputs.controllerRightButton1) {
        this.onFocus();
        if (this.click) {
          if (this.tempoClick === 0) {
            this.click();
            this.tempoClick = 1;
          }
        }
      } else {
        this.onFocus();
      }
    } else {
      this.onBlur();
    }
    this.tempoClick -= dt;
    this.tempoClick = Math.max(0, this.tempoClick);
  }
}

export default Button;
