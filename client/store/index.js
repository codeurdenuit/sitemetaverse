import universeHome from './universeHome';
import universeYoutube from './universeYoutube';
import universeTwitter from './universeTwitter';
import universeTest from './universeTest';
import universeHomeFake from './universeHomeFake';

import loadGltf from '../components/gltf';
import loadTexture from '../components/texture';

export default {
  indexUniverse: 0,
  indexNode:0,
  device: 'pc',
  universes: [
    universeHome,
    universeYoutube,
    universeTwitter,
    universeTest,
    universeHomeFake
  ],
  //apiHost: location.port === '3000' ? 'http://localhost:3030' : 'http://api.codeurdenuit.fr',
  apiHost: 'http://api.codeurdenuit.fr',
  assets: {},
  goTo(indexUniverse, indexNode) {
    this.indexUniverse = indexUniverse,
    this.indexNode = indexNode;
  },
  getGeometry(name) {
    if(!this.assets.meshesCache[name]) {
      this.assets.meshesCache[name] = this.assets.meshes.getObjectByName(name);
    }
    return this.assets.meshesCache[name].geometry;
  },
  getObject3D(name) {
    if(!this.assets.meshesCache[name]) {
      this.assets.meshesCache[name] = this.assets.meshes.getObjectByName(name);
    }
    return this.assets.meshesCache[name];
  },
  getAnimations() {
    return this.assets.meshes.animations; 
  },
  getTexture(name) {
    return this.assets[name]; 
  },
  async loadMesh(url) {
    this.assets.meshesCache = {};
    this.assets.meshes = await loadGltf(url);
  },
  loadTexture(url) {
    const name = url.split('.')[0].split('/').pop();
    this.assets[name] = loadTexture(url);
  }
};
