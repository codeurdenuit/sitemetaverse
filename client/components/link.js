import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';
import FontJSON from '../../public/Roboto-Medium-msdf.json';
import FontImage from '../../public/Roboto-Medium.png';


export default class Link extends THREE.Object3D {

  constructor(text, url, position) {
    super();

    this.linkContainer = new ThreeMeshUI.Block({
      textType: 'MSDF',
      fontFamily: FontJSON,
      fontTexture: FontImage,
      width: 2.5,
      height: 0.25,
      padding: 0.01,
      justifyContent: 'center',
      alignContent: position.x > 0 ? 'right' : 'left',
      backgroundOpacity: 0,
      fontOpacity: 1,
      fontColor: new THREE.Color(0x000000)
    });
    this.linkContainer.add(
      new ThreeMeshUI.Text({
        content: text,
        fontSize: 0.15
      })
    );
    this.url = url;
    this.add(this.linkContainer);
  }

  update(raycaster, inputs) {
    if (raycaster.intersectObject(this.linkContainer, true).length) {
      if (inputs.mouseButton || inputs.controllerRightButton1) {
        location.href = this.url;
      } else {
        document.body.style.cursor = 'pointer';
        this.linkContainer.set({
          fontColor: new THREE.Color(0xff44ff),
        });
      }
    } else {
      this.linkContainer.set({
        fontColor: new THREE.Color(0x000000),
      });
    }
  }

}
