import * as THREE from 'three';

const vertShader = `
  varying vec3 vPos;
  void main() 
  {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0 );
    vPos = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
  `;

const fragShader = `
  precision highp float;
  uniform vec3 origin;
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  varying vec3 vPos;
  float limitDistance = 30.0;
  float limitDistance2 = 40.0;
  void main() {
    float distance = clamp(length(vPos - origin), 0.0, limitDistance);
    vec3 colorStep1 = mix( color1, color2, distance / limitDistance);
    distance = clamp(length(vPos - origin), 0.0, limitDistance2);
    vec3 colorStep2 = mix( colorStep1, color3, distance / limitDistance2);
    gl_FragColor = vec4(colorStep2, 1.0);
  }
  `;

const material = new THREE.ShaderMaterial({
  uniforms: {
    color1: {
      value: new THREE.Color(0xd91ed4)
    },
    color2: {
      value: new THREE.Color(0x1830CA)
    },
    color3: {
      value: new THREE.Color(0x000000)
    },
    origin: {
      value: new THREE.Vector3()
    }
  },
  vertexShader: vertShader,
  fragmentShader: fragShader,
  transparent: false
});

export default material;
