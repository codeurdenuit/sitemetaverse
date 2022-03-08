import PlayerSyncClient from 'playersync/client';
import store from '../store';
import Visitor from './visitor';
import * as THREE from 'three';
export default class MultiVisitor {
  constructor() {
    this.roomId = 'visitors';
    this.psc = new PlayerSyncClient(store.apiHost);
    this.currentVisitors = {};
    this.universes = [];
    this.psc.onData(this.refreshVisitor.bind(this));
    this.psc.onRoomUpdated(this.refreshVisitors.bind(this));
    this.tempoOrder = 0.03;
    this.tempoValue = 0.03;
    this.userCameraPosition = new THREE.Vector3();
  }

  async init(universes) {
    this.universes = universes;
    this.userId = await this.psc.connect();

    const rooms = await this.psc.getRooms();
    let room;
    if (rooms[this.roomId]) {
      room = await this.psc.joinRoom(this.roomId);
    } else {
      room = await this.psc.createRoom(this.roomId);
    }
    this.refreshVisitors(room);
  }

  updateUser(dt, inputs, camera, position, indexUniverse) {
    this.tempoValue -= dt;
    if (this.tempoValue < 0) {
      this.tempoValue = this.tempoOrder;
      this.psc.sendData(Visitor.parse(inputs, camera, position, indexUniverse));
      this.userCameraPosition.copy(camera.position);
    }
  }

  refreshVisitor(visitorData, visitorId) {
    if (this.currentVisitors[visitorId]) {
      this.currentVisitors[visitorId].update(visitorData, this.universes, this.userCameraPosition);
    }
  }

  async refreshVisitors(visitorsList) {
    if (visitorsList) {
      for (let i = 0; i < visitorsList.length; i++) {
        const visitorId = visitorsList[i];
        if (visitorId !== this.userId && !this.currentVisitors[visitorId]) {
          this.currentVisitors[visitorId] = new Visitor();
        }
      }
      for (let key in this.currentVisitors) {
        if (visitorsList.indexOf(key) === -1) {
          this.currentVisitors[key].dismount();
          delete this.currentVisitors[key];
        }
      }
    }
  }
}
