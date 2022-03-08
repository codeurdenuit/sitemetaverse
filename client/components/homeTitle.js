import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';
import FontJSON from '../../public/Roboto-Medium-msdf.json';
import FontImage from '../../public/Roboto-Medium.png';
import materialTitle from '../materials/materialTitle';
import { TessellateModifier } from 'three/examples/jsm/modifiers/TessellateModifier.js';
import store from '../store';

const xorshift = {
  seed: 1,
  random() {
    this.seed ^= this.seed << 13;
    this.seed ^= this.seed >> 17;
    this.seed ^= this.seed >> 5;
    this.seed = (this.seed < 0) ? ~this.seed + 1 : this.seed;
    return this.seed / 2147483648;
  }
};

export default class HomeTitle extends THREE.Object3D {

  constructor() {
    super();

    this.mesh = store.getObject3D('title');
    this.mesh.material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: store.getTexture('textureColor') });

    this.z = 2;
    this.y = 3;

    const tessellateModifier = new TessellateModifier(0.1);
    const map = this.mesh.material.map;
    this.mesh.geometry.rotateX(Math.PI / 2);
    this.mesh.geometry = tessellateModifier.modify(this.mesh.geometry);

    this.mesh.material = materialTitle;
    this.mesh.material.uniforms.map.value = map;
    this.mesh.material.transparent = true;
    this.add(this.mesh);
    this.mesh.position.y = this.y;
    this.mesh.position.z = this.z;
    this.mesh.visible = false;
    this.mesh.geometry.computeBoundingSphere();
    this.mesh.geometry.computeBoundingBox();

    this.tempoParticleIn = 1;
    this.tempoDescription = 1;
    this.tempoParticleOut = 0;
    this.closing = false;
    this.display = true;
    this.cbStart = null;

    this.pointRef = this.mesh.geometry.attributes.position.clone();

    this.description();

    this.multilanguage();
  }

  description() {
    const description = new ThreeMeshUI.Block({
      height: 0.30,
      width: 5,
      alignContent: 'center',
      textType: 'MSDF',
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0xcccccc),
      fontOpacity: 0,
      backgroundOpacity: 0,
      backgroundColor: new THREE.Color(0x111111),
    });

    description.add(
      new ThreeMeshUI.Text({
        content: store.universes[0].scene.description,
        fontSize: 0.2
      })
    );

    description.position.set(0, 1, 0);

    this.add(description);
    this.description = description;

  }

  updateVerticesTitle(progress, left) {
    const positions = this.mesh.geometry.attributes.position.array;
    const positionsRef = this.pointRef.array;
    const pi = Math.PI;

    const length = positions.length;

    if (left) {
      for (let i = 0, l = length; i < l; i += 9) {
        const x = positionsRef[i + 0];
        const y = positionsRef[i + 1];

        let progresTempo = progress * 2 - (x + 1) / 2 * (1 / 2);
        progresTempo = Math.max(0, progresTempo);
        progresTempo = Math.min(1, progresTempo);

        let harmonicX = 0;
        let harmonicY = 0;

        const offsetY = progresTempo * Math.cos(progresTempo * pi * 2 + x * 1) * 1;
        const offsetX = progresTempo * progresTempo * 8;

        xorshift.seed = Math.floor(x * y * 1000);
        xorshift.random();

        harmonicY += progresTempo * (xorshift.random() - 0.5) * 7;
        harmonicX += progresTempo * progresTempo * xorshift.random() * 7;
        harmonicX += (progresTempo + 0.3) * Math.cos(progresTempo * pi + pi / 2) * 5;

        positions[i + 0] = positionsRef[i + 0] + offsetX + harmonicX;
        positions[i + 1] = positionsRef[i + 1] + offsetY + harmonicY;
        positions[i + 3 + 0] = positionsRef[i + 3 + 0] + offsetX + harmonicX;
        positions[i + 3 + 1] = positionsRef[i + 3 + 1] + offsetY + harmonicY;
        positions[i + 6 + 0] = positionsRef[i + 6 + 0] + offsetX + harmonicX;
        positions[i + 6 + 1] = positionsRef[i + 6 + 1] + offsetY + harmonicY;
      }
    } else {
      for (let i = 0, l = length; i < l; i += 9) {
        const x = positionsRef[i + 0];
        const y = positionsRef[i + 1];

        let progresTempo = progress * 2 - (x + 1) / 2 * (1 / 2);
        progresTempo = Math.max(0, progresTempo);
        progresTempo = Math.min(1, progresTempo);
        progresTempo = 1 - progresTempo;

        let harmonicX = 0;
        let harmonicY = 0;

        const offsetY = progresTempo * Math.cos(progresTempo * pi * 2 + x * 1) * 1;
        const offsetX = -progresTempo * progresTempo * 8;

        xorshift.seed = Math.floor(x * y * 1000);
        xorshift.random();

        harmonicY += progresTempo * (xorshift.random() - 0.5) * 7;
        harmonicX += -progresTempo * progresTempo * xorshift.random() * 7;
        harmonicX += -(progresTempo + 0.3) * Math.cos(progresTempo * pi + pi / 2) * 5;

        positions[i + 0] = positionsRef[i + 0] + offsetX + harmonicX;
        positions[i + 1] = positionsRef[i + 1] + offsetY + harmonicY;
        positions[i + 3 + 0] = positionsRef[i + 3 + 0] + offsetX + harmonicX;
        positions[i + 3 + 1] = positionsRef[i + 3 + 1] + offsetY + harmonicY;
        positions[i + 6 + 0] = positionsRef[i + 6 + 0] + offsetX + harmonicX;
        positions[i + 6 + 1] = positionsRef[i + 6 + 1] + offsetY + harmonicY;
      }
    }

    this.mesh.geometry.attributes.position.needsUpdate = true;
  }

  onStart(cb) {
    this.cbStart = cb;
  }


  update(dt, inputs, raycaster) {
    this.mesh.visible = true;

    if (this.tempoParticleIn > 0) {
      this.tempoParticleIn -= dt;
      this.mesh.visible = true;
      if (this.tempoParticleIn < 0) this.tempoParticleIn = 0;
      this.mesh.material.uniforms.opacity.value = Math.min((1 - this.tempoParticleIn), 1);
      this.updateVerticesTitle(this.tempoParticleIn / 2, true);
    } else {
      if (!this.closing) {
        if (raycaster && raycaster.intersectObject(this.mesh).length) {
          if (inputs.mouseButton || inputs.controllerRightButton1) {
            this.tempoParticleOut = 1;
            this.closing = true;
          } else {
            document.body.style.cursor = 'pointer';
            this.mesh.material.uniforms.color.value = new THREE.Color(0xff44ff);
          }
        } else {
          this.mesh.material.uniforms.color.value = new THREE.Color(0xffffff);
        }

        let descOpacity = this.description.fontOpacity;
        if (descOpacity != 1) {
          descOpacity += dt;
          descOpacity = Math.min(descOpacity, 1);
          this.description.set({
            fontOpacity: descOpacity
          });
        }

      } else {
        if (this.tempoParticleOut > 0) {
          this.tempoParticleOut -= dt;
          if (this.tempoParticleOut < 0) this.tempoParticleOut = 0;
          this.mesh.material.uniforms.opacity.value = this.tempoParticleOut / 1;
          this.updateVerticesTitle(this.tempoParticleOut / 1, false);
          this.description.set({
            fontOpacity: this.tempoParticleOut / 1
          });
        } else {
          this.mesh.visible = false;
          this.description.visible = false;
          if(this.display) {
            this.display = false;
            if (this.cbStart) {
              this.cbStart();
              this.nodeLang.remove();
            }
          }
        }
      }
    }
  }

  multilanguage() {
    const node = document.createElement('div');
    node.className = 'lang';
    const link1 = document.createElement('a');
    link1.href = 'https://www.codeurdenuit.fr/';
    link1.textContent = '[fr]';
    const link2 = document.createElement('a');
    link2.href = 'https://www.codeurdenuit.net/';
    link2.textContent = '[en]';
    node.appendChild(link1);
    node.appendChild(link2);
    document.body.appendChild(node);
    this.nodeLang = node;
  }

}
