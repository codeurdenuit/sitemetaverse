import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';
import FontJSON from '../../public/Roboto-Medium-msdf.json';
import FontImage from '../../public/Roboto-Medium.png';
import store from '../store';

const divVideo = document.createElement('video');
divVideo.crossOrigin = 'anonymous';
divVideo.playsinline = true;
divVideo.style = 'display:none';
divVideo.muted = false;
const divSource = document.createElement('source');
divSource.type = 'video/mp4';
divSource.codecs = 'avc1.42E01E, mp4a.40.2';
divVideo.appendChild(divSource);
const videoTexture = new THREE.VideoTexture(divVideo);

class PanelVideo extends THREE.Object3D {

  constructor(title, description, videoUrl, link, thumbnail) {
    super();
    
    const shadowMesh = store.getObject3D('shadowPanel');
    shadowMesh.material = new THREE.MeshBasicMaterial({ map: store.getTexture('textureColor') });

    this.raycaster = new THREE.Raycaster();
    this.playing = false;
    this.opacity = 0;
    this.tempo = null;
    this.divVideo = null;
    this.link = link;
    this.width = 2;
    this.videoUrl = videoUrl;
    this.divVideo = divVideo;

    const titleContainer = new ThreeMeshUI.Block({
      alignContent: 'left',
      textType: 'MSDF',
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0x111111),
      width: 2.02,
      height: 0.14,
      padding: 0.02,
      margin: 0,
      backgroundOpacity: 0,
    });
    titleContainer.add(
      new ThreeMeshUI.Text({
        content: title,
        fontSize: 0.083
      })
    );
    titleContainer.position.y = 0.15;

    const linkContainer = new ThreeMeshUI.Block({
      textType: 'MSDF',
      fontFamily: FontJSON,
      fontTexture: FontImage,
      width: this.width,
      height: this.width * 0.56,
      padding: 0.01,
      margin: 0,
      borderRadius: 0,
      justifyContent: 'center',
      backgroundOpacity: 0.5,
      alignContent: 'center',
      fontColor: new THREE.Color(0xffffff),
      backgroundColor: new THREE.Color(0x000000),
    });

    linkContainer.add(
      new ThreeMeshUI.Text({
        content: 'Voir la video',
        fontSize: 0.2
      })
    );

    this.linkContainer = linkContainer;
    this.linkContainer.visible = false;
    this.linkContainer.position.z += 0.01;

    const loaderMap = new THREE.TextureLoader();
    this.thumbnail = loaderMap.load(thumbnail);
    this.videoMat = new THREE.MeshBasicMaterial({ color: 0xffffff, map: this.thumbnail, side: THREE.DoubleSide });

    const imageContainer = new THREE.Mesh(new THREE.PlaneGeometry(this.width, this.width * 0.56), this.videoMat);
    imageContainer.position.set(0, 0.797, 0);
    this.imageContainer = imageContainer;
    this.imageContainer.add(linkContainer);

    const progressBar = new THREE.Mesh(new THREE.PlaneGeometry(this.width, 0.025), new THREE.MeshBasicMaterial({ color: 0x222222 }));
    progressBar.position.set(0, -this.width * 0.56 / 2 - 0.025 / 2, 0);
    const progress = new THREE.Mesh(new THREE.PlaneGeometry(this.width, 0.025), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    progressBar.add(progress);
    progress.position.set(0, 0.0, 0.005);
    this.progress = progress;

    this.add(titleContainer);

    this.add(imageContainer);
    imageContainer.add(progressBar);

    this.add(shadowMesh);
    shadowMesh.position.y = 0.01;

    this.titleContainer = titleContainer;
    this.progress.parent.visible = false;
    this.smoothProgress = 0;
  }

  loadVideo(url) {
    divSource.src = url;
    document.body.appendChild(divVideo);
    return videoTexture;
  }

  play() {
    if (!this.playing) {
      this.playing = true;
      this.opacity = 0;
      this.progress.parent.visible = true;
      if (divSource.src !== this.videoUrl) {
        document.body.appendChild(divVideo);
        divSource.src = this.videoUrl;
        divVideo.load();
        this.videoMat.map = videoTexture;
      }
      if (this.divVideo.currentTime === 0 || this.divVideo.paused) {
        this.divVideo.play();
        this.divVideo.muted = false;
      }
    }
  }

  pause() {
    if (this.playing) {
      this.playing = false;
      this.opacity = 1;
      this.divVideo.pause();
      this.progress.parent.visible = false;
      this.videoMat.map = this.thumbnail;
    }
  }

  onClick(callback) {
    this.click = callback;
  }

  updateProgress() {
    if (this.divVideo && this.divVideo.currentTime > 0 && !this.divVideo.paused) {
      const percent = this.divVideo.currentTime / this.divVideo.duration;
      const progressWidth = this.width * percent;
      const offest = progressWidth / 2;
      this.progress.scale.set(percent, 1, 1);
      this.progress.position.x = -this.width / 2 + offest;
    }
  }

  update(dt, raycaster, inputs) {
    if (this.playing) {
      this.opacity += dt;
      this.smoothProgress = this.opacity * this.opacity;
      if (this.opacity > 1) this.opacity = 1;
    } else {
      this.opacity -= dt;
      this.smoothProgress = this.opacity * this.opacity;
      if (this.opacity < 0) this.opacity = 0;
    }

    this.titleContainer.set({
      fontOpacity: this.smoothProgress,
    });

    this.linkContainer.visible = false;
    if (raycaster && raycaster.intersectObject(this.imageContainer).length) {
      if (inputs.mouseButton || inputs.controllerRightButton1) {
        if (this.playing) {
          location.href = this.link;
        } else {
          this.click();
        }

      } else {
        document.body.style.cursor = 'pointer';
        if (this.playing) {
          this.linkContainer.visible = true;
        }
      }
    }

    this.updateProgress();
  }
}

export default PanelVideo;
