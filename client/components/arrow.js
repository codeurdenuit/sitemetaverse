import * as THREE from 'three';

class Arrow extends THREE.Mesh {

  constructor(arrowW = 1, arrowH = 1, QueueW = 0.5, color) {
    super();
    const vertices = new Float32Array([-arrowW / 2, -arrowH / 2, 0, arrowW, 0, 0, -arrowW / 2, arrowH / 2, 0,
      -arrowW / 2, arrowH / 4, 0, -arrowW / 2 - QueueW, arrowH / 4, 0, -arrowW / 2, -arrowH / 4, 0,
      -arrowW / 2 - QueueW, arrowH / 4, 0, -arrowW / 2 - QueueW, -arrowH / 4, 0, -arrowW / 2, -arrowH / 4, 0
    ]);

    this.geometry = new THREE.BufferGeometry();
    this.colorFocus = new THREE.Color(0xff44ff);
    this.colorBlur = new THREE.Color(color || 0xdddddd);

    this.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    this.material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });

    this.click = null;
    this.tempoClick = 0;
    this.onBlur();
  }


  onFocus() {
    document.body.style.cursor = 'pointer';
    this.material.color = this.colorFocus;
  }

  onBlur() {
    this.material.color = this.colorBlur;
  }

  onClick(callback) {
    this.click = callback;
  }

  update(dt, raycaster, inputs) {
    if(this.material.opacity >0.8) {
      if (raycaster.intersectObject(this).length) {
        if (inputs.mouseButton) {
          this.onFocus();
          if (this.click) {
            if (this.tempoClick === 0) {
              this.click();
              this.tempoClick = 1;
            }
          }
        } else {
          this.onFocus();
        }
      } else {
        this.onBlur();
      }
    }
    this.tempoClick -= dt;
    this.tempoClick = Math.max(0, this.tempoClick);
  }
}

export default Arrow;