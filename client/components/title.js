import * as THREE from 'three';

import ThreeMeshUI from 'three-mesh-ui';
import FontJSON from '../../public/Roboto-Medium-msdf.json';
import FontImage from '../../public/Roboto-Medium.png';

class Title extends THREE.Object3D {

  constructor(title, size, color) {
    super();

    const container = new ThreeMeshUI.Block({
      height: 0.9 * size,
      width: 9.6 * size,
      padding: 0,
      marging: 0,
      textType: 'MSDF',
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: color || new THREE.Color(0xdddddd),
      fontOpacity: this.opacityTextTarget,
      backgroundOpacity: 0,
      backgroundColor: new THREE.Color(0x00cc00),
      alignContent: 'left'
    });

    container.add(
      new ThreeMeshUI.Text({
        content: title,
        fontSize: 0.9 * size
      })
    );
    this.add(container);
    this.container = container;
  }
}

export default Title;
