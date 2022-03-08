import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const loaderGlb = new GLTFLoader();

function loadGLTF(path, material) {
  return new Promise((resolve, reject) => {
    loaderGlb.load(path,
      function (gltf) {
        function prepareObject(node) {
          const children = node.children;
          for (let i = 0; i < children.length; i++) {
            let child = children[i];
            if (child.material) {
              child.material = material;
            }
            if (child.geometry && child.geometry.attributes.uv) {
              child.geometry.setAttribute('uv2', new THREE.BufferAttribute(child.geometry.getAttribute('uv').array, 2));
            }
            if (child.geometry && !child.geometry.attributes.normal) {
              child.geometry.computeVertexNormals();
            }
            if (child.type === 'PointLight') {
              child.position.copy(node.position);
              node.position.set(0, 0, 0);
              child.name = node.name;
              node.name = '';
            }
            if (child.children) {
              prepareObject(child);
            }
          }
        }
        prepareObject(gltf.scene);
        gltf.scene.animations = gltf.animations;
        resolve(gltf.scene);
      }, undefined, function (e) {
        console.error(e);
        reject(e);
      });
  });
}

export default loadGLTF;
