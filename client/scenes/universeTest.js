import * as THREE from 'three';
import Scene from '../components/scene';
import Grid from '../components/grid';
import materialLineOpacity from '../materials/materialLineOpacity';
import Laser from '../components/laser';
import store from '../store';

export default class UniverseTwitter extends Scene {

  async init() {
    this.light = new THREE.PointLight(0xffffff);
    this.light.position.set(0, 1, 0);
    this.light.intensity = 0.5;
    this.add(this.light);

    const unity = 3;
    const width = 2000;
    const depth = 2000;
    const height = 2000;

    this.meshBox = new THREE.Mesh(
      new THREE.BoxGeometry(width + .04, height + .04, depth + .04).translate(unity / 2, height / 2, unity / 2),
      new THREE.MeshBasicMaterial({ color: 0x1111aa, side: THREE.BackSide })
    );
    this.meshBox.position.y = -height / 2;
    this.add(this.meshBox);
    const gridGeo = new Grid(3 * 100, 3 * 100, 100, 100);
    this.grid = new THREE.Line(gridGeo, materialLineOpacity);
    this.root.add(this.grid);
    this.grid.renderOrder = 2;

    this.materialLineOpacity = materialLineOpacity;

    this.fog = new THREE.FogExp2(0xaa0000, 0.001);
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 5000; i++) {
      const x = 2000 * Math.random() - 1000;
      const y = 2000 * Math.random() - 1000;
      const z = 2000 * Math.random() - 1000;
      vertices.push(x, y, z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    this.materialPoint = new THREE.PointsMaterial({ size: 30, sizeAttenuation: true, map: this.getTexture(), alphaTest: 0.5, transparent: true });
    this.materialPoint.color.setHSL(1.0, 0.3, 0.7);

    const particles = new THREE.Points(geometry, this.materialPoint);
    this.root.add(particles);
    this.userPosition = new THREE.Vector3();
    this.nextWorldOpened = false;

    this.laser = new Laser();
    this.add(this.laser);
  }

  afterComing() {
    setTimeout(() => {
      this.closeUniverse();
      this.nextWorldOpened = false;
    }, 200);

  }

  update(dt, inputs, camera) {

    this.light.position.copy(camera.position);

    this.laser.update(inputs);

    this.materialLineOpacity.uniforms.origin.value.set(camera.position.x, 0, camera.position.z);
    this.userPosition.copy(this.root.position).negate();

    const x = Math.floor(this.userPosition.x / 3) * 3;
    const z = Math.floor(this.userPosition.z / 3) * 3;
    this.grid.position.x = x;
    this.grid.position.z = z;

    if (this.userPosition.z < - 200 && !this.nextWorldOpened) {
      this.nextWorldOpened = true;
      this.openNextUniverse();
    }

  }

  openNextUniverse() {
    const nextNode = store.universes[this.index].nodes[1];
    this.openUniverse(nextNode.portalUniverse, nextNode.portalPos[store.device]);
  }

  onDeviceChange() {
  }

  getTexture() {
    const canvas = document.createElement('canvas');
    const diameter = 64;
    canvas.width = diameter;
    canvas.height = diameter;
    const canvasRadius = diameter / 2;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.0)';
    ctx.fillRect(0, 0, diameter, diameter);
    ctx.restore();

    const gradient = ctx.createRadialGradient(canvasRadius, canvasRadius, 0, canvasRadius, canvasRadius, canvasRadius);
    gradient.addColorStop(0, 'rgba(255,255,255,1.0)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, diameter, diameter);


    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

}
