import * as THREE from 'three';

const vertShader = `
  precision highp float;
  precision highp int;
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  attribute vec3 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
     vec4 worldPosition = modelMatrix * vec4(position, 1.0 );
     vUv = uv;
     gl_Position = projectionMatrix * viewMatrix * worldPosition;
  } `;


const fragShader = `
  precision highp float;
  precision highp int;
  uniform vec3 color;
  uniform float opacity;
  uniform sampler2D map;
  varying vec2 vUv;
  void main(void) {
     vec3 rgb = texture2D( map, vUv ).xyz*color;
     gl_FragColor = vec4(rgb , rgb.x*opacity);
  }`;

const uniforms = {
  opacity: { type: 'f', value: 0 },
  color: { value: new THREE.Color(0xffffff)},
  map: { type: 't' }
};

const material = new THREE.RawShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertShader,
  fragmentShader: fragShader,
  shadowSide: THREE.FrontSide,
  transparent: true
});

export default material;
