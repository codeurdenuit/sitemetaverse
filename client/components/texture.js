import * as THREE from 'three';

function loadGLTF(url) {
  const loaderMap = new THREE.TextureLoader();
  const map = loaderMap.load(url);
  map.flipY = false;
  return map;
}

export default loadGLTF;
