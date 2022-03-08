import * as THREE from 'three';
class Grid extends THREE.BufferGeometry {

  constructor(width = 1, depth = 1, widthSegments = 1, depthSegments = 1) {
    super();

    widthSegments = Math.floor(widthSegments);
    depthSegments = Math.floor(depthSegments);

    const widthHalf = width / 2;
    const depthHalf = depth / 2;

    const segmentWidth = width / widthSegments;
    const segmentDepth = depth / depthSegments;

    const vertices = [];

    let x = - widthHalf;
    let z = - depthHalf;

    for (let i = 0; i <= widthSegments; i++) {

      vertices.push(x, - 0, - depthHalf, x, 0, - depthHalf);
      vertices.push(x, 0, - depthHalf, x, 0, depthHalf);
      vertices.push(x, 0, depthHalf, x, - 0, depthHalf);
      vertices.push(x, - 0, depthHalf, x, - 0, - depthHalf);

      x += segmentWidth;
    }

    for (let i = 0; i <= depthSegments; i++) {

      vertices.push(- widthHalf, - 0, z, - widthHalf, 0, z);
      vertices.push(- widthHalf, 0, z, widthHalf, 0, z);
      vertices.push(widthHalf, 0, z, widthHalf, - 0, z);
      vertices.push(widthHalf, - 0, z, - widthHalf, - 0, z);

      z += segmentDepth;
    }

    this.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  }

}

export default Grid;
