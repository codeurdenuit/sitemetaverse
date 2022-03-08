import * as THREE from 'three';
const geometryBox = new THREE.BoxGeometry(600, 600, 600).translate(0, 299.95, 0);
const pi = Math.PI;

class Sky extends THREE.Mesh {

  constructor(radius = 50, dendity = 200) {
    super();

    this.progress = 0;
    this.radius = radius;
    const sprite = this.getTexture();

    this.geometry = geometryBox;
    this.material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });

    this.layout1 = this.computeStars(radius, dendity, 0xffaaaa, 3);

    this.layout2 = this.computeStars(radius, dendity * 2, 0xaaaaaa, 1);

    this.layout3 = this.computeFirefly(radius, dendity, 0xff44ff, 0x0000ff, 2.6, sprite);

    this.layout4 = this.computeFirefly(radius, dendity, 0xff44ff, 0x0000ff, 2.6, sprite);

    this.add(this.layout1);
    this.add(this.layout2);
    this.dynamicLayout = new THREE.Object3D();
    this.dynamicLayout.add(this.layout3, this.layout4);
  }

  computeStars(radius, count, color, size) {
    const vertices = [];
    for (let i = 0; i < count; i++) {
      const phi = Math.random() * pi;
      const theta = Math.random() * pi;
      const sinphi = Math.sin(phi);
      vertices.push(
        radius * sinphi * Math.sin(theta),
        radius * Math.cos(phi),
        radius * sinphi * Math.cos(theta),
      );
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    const mesh = new THREE.Points(geometry, new THREE.PointsMaterial({ color, size, sizeAttenuation: false }));
    mesh.rotateZ(pi / 2);
    return mesh;
  }

  computeFirefly(radius, count, col1, col2, size, sprite) {
    const vertices = [], colors = [];
    const color1 = new THREE.Color(col1);
    const color2 = new THREE.Color(col2);
    for (let i = 0; i < count; i++) {
      vertices.push(
        2 * radius * (Math.random() - 0.5),
        radius * (Math.random()),
        2 * radius * (Math.random() - 0.5)
      );
      const blend = Math.random();
      const blendneg = 1 - blend;
      colors.push(
        color1.r * blend + color2.r * blendneg,
        color1.g * blend + color2.g * blendneg,
        color1.b * blend + color2.b * blendneg,
      );
    }
    const Layout3Geo = new THREE.BufferGeometry();
    Layout3Geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    Layout3Geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
    return new THREE.Points(Layout3Geo, new THREE.PointsMaterial({ size, vertexColors: true, map: sprite, transparent: true }));
  }

  getTexture() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    const diameter = 200;
    canvas.width = diameter;
    canvas.height = diameter;
    const canvasRadius = diameter / 2;

    const gradient = ctx.createRadialGradient(canvasRadius, canvasRadius, 0, canvasRadius, canvasRadius, canvasRadius);
    gradient.addColorStop(0, 'rgba(255,255,255,1.0)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, diameter, diameter);
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  update(dt) {
    this.progress += dt / 30;

    if (this.progress > Math.P2 * 2) {
      this.progress = 0;
    }

    this.layout3.position.x = this.radius * 0.33 * Math.cos(this.progress);
    this.layout3.position.z = this.radius * 0.33 * Math.sin(this.progress);
    this.layout4.position.x = -this.radius * 0.33 * Math.cos(this.progress);
    this.layout4.position.z = this.radius * 0.33 * Math.sin(this.progress);
  }

}

export default Sky;
