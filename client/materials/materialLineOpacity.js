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
  varying vec3 vPos;
  float limitDistance = 60.0;
  void main() {
    float distance = clamp(length(vPos - origin), 0.0, limitDistance);
    float opacity = mix( 1.0, 0.0, distance / limitDistance);
    gl_FragColor = vec4(color1, opacity);
  }
  `;

const material = new THREE.ShaderMaterial({
  uniforms: {
    color1: {
      value: new THREE.Color(0xd91ed4)
    },
    origin: {
      value: new THREE.Vector3()
    }
  },
  vertexShader: vertShader,
  fragmentShader: fragShader,
  transparent: true
});

export default material;
