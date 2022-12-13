import * as THREE from 'three';

import ThreeMeshUI from 'three-mesh-ui';
import FontJSON from '../../public/Roboto-Medium-msdf.json';
import FontImage from '../../public/Roboto-Medium.png';
import store from '../store';

class PanelTweet extends THREE.Object3D {

  constructor(text, date, thumbnail) {
    super();

    const meshLogo = store.getObject3D('logo');
    meshLogo.material = new THREE.MeshBasicMaterial({map: store.getTexture('textureColor') });

    const width = 2;
    const widthContent = 1.65;
    let heightContent = 0.53;
    let heightAuthor = 0.13;
    let padding = 0.04;

    this.link = null;
    this.tempoClick = 0;

    const authorContainer = new ThreeMeshUI.Block({
      width: widthContent,
      height: heightAuthor,
      padding: padding,
      margin: 0,
      borderRadius: 0,
      alignContent: 'left',
      backgroundOpacity: 0,
    });

    authorContainer.add(
      new ThreeMeshUI.Text({
        content: 'Codeur de nuit  ',
        fontColor: new THREE.Color(0x000000),
        fontSize: 0.06
      })
    );

    let cleanText = '@Codeur_de_nuit  .  ' + new Date(date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: '2-digit' })
    cleanText = cleanText.replace(/û/g, '')
    authorContainer.add(
      new ThreeMeshUI.Text({
        content: cleanText,
        fontColor: new THREE.Color(0x888888),
        fontSize: 0.055,
      })
    );

    cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    let hashtagsContainer;
    const hashList = text.match(/(^|\s)(#[a-z\d-]+)/ig);
    if (hashList) {
      const texthashtag = hashList.map(val => val.replace('\n', '')).slice(0, 6).join(' ');
      cleanText = cleanText.replace(/(^|\s)(#[a-z\d-]+)/ig, '');
      hashtagsContainer = new ThreeMeshUI.Block({
        width: widthContent,
        height: 0.05,
        padding: 0.02,
        margin: 0,
        borderRadius: 0,
        alignContent: 'left',
        backgroundOpacity: 0,
      });

      hashtagsContainer.add(
        new ThreeMeshUI.Text({
          content: texthashtag,
          fontColor: new THREE.Color(0x0000ff),
          fontSize: 0.055
        })
      );
    }

    const links = cleanText.match(/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi);
    if (links) {
      this.link = 'https://' + links[0];
    }

    const jumps = text.match(/(\n)/ig);

    if (jumps.length < 4 && cleanText.length < 250) {
      heightContent *= 0.64;
    } else if (jumps.length < 6) {
      heightContent *= 0.85;
    }

    const textContainer = new ThreeMeshUI.Block({
      width: widthContent,
      height: heightContent,
      padding: 0.03,
      margin: 0,
      borderRadius: 0,
      alignContent: 'left',
      backgroundOpacity: 0,
    });

    textContainer.add(
      new ThreeMeshUI.Text({
        content: cleanText,
        fontColor: new THREE.Color(0x333333),
        fontSize: 0.055
      })
    );


    let heightThubnail = 0;
    let thumbnailContainer;
    let marginThumbnail = 0.05;
    if (thumbnail) {
      heightThubnail = widthContent * 0.52;
      const loaderMap = new THREE.TextureLoader();
      thumbnailContainer = new ThreeMeshUI.Block({
        width: widthContent,
        height: heightThubnail,
        padding: 0,
        margin: marginThumbnail,
        borderRadius: 0,
        alignContent: 'right',
        backgroundOpacity: 1,
      });

      loaderMap.load(thumbnail, (texture) => {
        thumbnailContainer.set({
          backgroundTexture: texture,
        });
      });
    }

    const height = heightContent + heightAuthor * 2 + (padding ? (padding * 2 + heightThubnail + marginThumbnail * 2) : 0);
    const container = new ThreeMeshUI.Block({
      padding: padding,
      width: 2,
      height: height,
      alignContent: 'right',
      textType: 'MSDF',
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0x333333),
      backgroundOpacity: 1,
      fontOpacity: 1,
      backgroundColor: new THREE.Color(0xeeeeee),
      borderRadius: [0.02, 0.02, 0.02, 0.02],
    });

    const marginLogo = 0.16;
    meshLogo.position.set(-width / 2 + marginLogo, height / 2 - marginLogo - 0.015, 0.002);
    meshLogo.scale.multiplyScalar(0.2);
    meshLogo.rotation.x = Math.PI / 2;

    container.position.set(0, height / 2, 0);
    container.add(authorContainer, textContainer);
    if (hashtagsContainer) container.add(hashtagsContainer);
    if (thumbnailContainer) container.add(thumbnailContainer);
    container.add(meshLogo);

    this.add(container);
    this.container = container;

  }

  onClick(callback) {
    this.click = callback;
  }

  update(dt, raycaster, inputs, enabled) {
    if (enabled && raycaster.intersectObject(this.container, true).length) {
      if (inputs.mouseButton || inputs.controllerRightButton1) {
        if (this.tempoClick === 0) {
          this.click();
          this.tempoClick = 1;
        }
      } else {
        document.body.style.cursor = 'pointer';
      }
    }

    this.tempoClick -= dt;
    this.tempoClick = Math.max(0, this.tempoClick);
  }

}

export default PanelTweet;
