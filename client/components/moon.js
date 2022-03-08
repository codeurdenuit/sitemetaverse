

import * as THREE from 'three';

class Moon extends THREE.Object3D {

  constructor() {
    super();
    const moonMaterial = new THREE.MeshBasicMaterial({ map: this.getTexture(), color: 0xffeeff });
    const moonMesh = new THREE.Mesh(new THREE.PlaneGeometry(25 * 4, 25 * 4), moonMaterial);
    this.add(moonMesh);
    this.moonMesh = moonMesh;
  }

  getTexture() {
    const canvas = document.createElement('canvas');
    const diameter = 512;
    canvas.width = diameter;
    canvas.height = diameter;
    const canvasRadius = diameter / 2;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, diameter, diameter);
    ctx.restore();
    ctx.fillStyle = '#FFFFFF';
    ctx.arc(canvasRadius, canvasRadius, canvasRadius, 0, 2 * Math.PI);
    ctx.fill();
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }
}

export default Moon;
