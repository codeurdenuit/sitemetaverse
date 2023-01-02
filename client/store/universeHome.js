import { Vector3 } from 'three';
import fr from './wordingFr';
import en from './wordingEn';
const wording = location.host.includes('.fr') ? fr : en;

const offsetZ = -3;
export default {
  nodes: [
    {
      camOrigin: { pc: new Vector3(0, 3.7, 0), mo: new Vector3(0, 3.7 + 2, 6), vr: new Vector3(0, 3.7, 0) },
      camTarget: { pc: new Vector3(0, 3.7, -7), mo: new Vector3(0, 3.7 + 2, -1), vr: new Vector3(0, 3.7, -7) }
    },
    {
      camOrigin: { pc: new Vector3(0, 2.5, -6 + offsetZ), mo: new Vector3(-4.2, 4, -3.8 + offsetZ), vr: new Vector3(0, 2.5, -6 + offsetZ) },
      camTarget: { pc: new Vector3(1.5, 0, -10.5 + offsetZ), mo: new Vector3(-2.5, 1, -10.5 + offsetZ), vr: new Vector3(1.5, 0, -10.5 + offsetZ) }
    },
    {
      camOrigin: { pc: new Vector3(0, 2.5, -15 + offsetZ), mo: new Vector3(4.2, 4, -12.8 + offsetZ), vr: new Vector3(0, 2.5, -15 + offsetZ) },
      camTarget: { pc: new Vector3(-1.5, 0, -19.5 + offsetZ), mo: new Vector3(2.5, 1, -19.5 + offsetZ), vr: new Vector3(-1.5, 0, -19.5 + offsetZ) },
      portalUniverse: 1,
      portalNode: 0,
      portalPos: { pc: new Vector3(0, 0, -19 + offsetZ), mo: new Vector3(3, 0, -18 + offsetZ), vr: new Vector3(0, 0, -19 + offsetZ) },
    },
    {
      camOrigin: { pc: new Vector3(0, 2.5, -24 + offsetZ), mo: new Vector3(-4.2, 3.2, -21.8 + offsetZ), vr: new Vector3(0, 2.5, -24 + offsetZ) },
      camTarget: { pc: new Vector3(1.5, 0, -28.5 + offsetZ), mo: new Vector3(-2.5, 1, -28.5 + offsetZ), vr: new Vector3(1.5, 0, -28.5 + offsetZ) },
      portalUniverse: 2,
      portalNode: 6,
      portalPos: { pc: new Vector3(0, 0, -28 + offsetZ), mo: new Vector3(-3, 0, -27 + offsetZ), vr: new Vector3(0, 0, -28 + offsetZ) },
    },
    {
      camOrigin: { pc: new Vector3(0, 2.5, -33 + offsetZ), mo: new Vector3(4.2, 4, -30.8 + offsetZ), vr: new Vector3(0, 2.5, -33 + offsetZ) },
      camTarget: { pc: new Vector3(-1.5, 0, -37.5 + offsetZ), mo: new Vector3(2.5, 1, -37.5 + offsetZ), vr: new Vector3(-1.5, 0, -37.5 + offsetZ) },
      portalUniverse: 3,
      portalNode: 0,
      portalPos: { pc: new Vector3(0, 0, -37 + offsetZ), mo: new Vector3(3, 0, -36 + offsetZ), vr: new Vector3(0, 0, -37 + offsetZ) },
    },
    {
      camOrigin: { pc: new Vector3(2.2, 2.5, -5.5 + offsetZ), mo: new Vector3(-4, 2.5, -4.5  +offsetZ), vr: new Vector3(2, 2.5, -78 + offsetZ) },
      camTarget: { pc: new Vector3(6, 0, -7 + offsetZ), mo: new Vector3(-1.2, 1.5, -6.4 +  offsetZ), vr: new Vector3(0, 2, -7.5 + offsetZ) }
    },

  ],
  scene: {
    description:  wording.description,
    moonPos: { pc: new Vector3(0, 60, -220), mo: new Vector3(0, 60, -220), vr: new Vector3(0, 80, -220) },
    titlePos: { pc: new Vector3(0, 0, -7), mo: new Vector3(0, 1, -3), vr: new Vector3(0, -2, -7) },
    treePos: { pc: new Vector3(0, 0, -7), mo: new Vector3(-0.1, 2.4, -2), vr: new Vector3(0, -2, -7) },
    catPos: { pc: new Vector3(0, 0, -7), mo: new Vector3(-0.1, 2.4, -2), vr: new Vector3(0, -2, -7) },
    areaPos: { pc: new Vector3(1.5, 0, -5.5), mo: new Vector3(1.5, 0, -5.5), vr: new Vector3(1.5, 0, -5.5) },
    skyPos: { pc: new Vector3(0, 0 - 0.01, 0), mo: new Vector3(0, -0.01, 0), vr: new Vector3(0, -0.01, 0) },
    descriptionVisible: { pc: true, mo: true, vr: false },
    backVisible: { pc: true, mo: true, vr: false },
    offsetTriggerForward :{ pc: 1, mo: 3, vr:3 },
    offsetTriggerBackward :{ pc: 8, mo: 8, vr:3 },
    infoText : wording.infoText,
    infoTitle : wording.infoTitle,
    infoPosition:  { pc: new Vector3(4.5, 1.75, -9.8), mo: new Vector3(-1.5, 1.75, -9.3), vr: new Vector3(4.5, 1.75, -9.8) },
    infoBackPosition:  { pc: new Vector3( -0.4, -1.74, 0.5), mo: new Vector3( -0.4, -1.74, 0.5), vr: new Vector3(0, -1.74, 1) },
    rooms: [
      {
        indexNode: 1,
        mesh: 'room1',
        icon: 'icon-codeurdenuit',
        title: wording.rooms[0].title,
        text: wording.rooms[0].text,
        anim: 'codeur',
        button: wording.rooms[0].button,
        vrOnly: false,
        colorShape: 0x000001,
        links: [{ text: 'dungeonvr.codeurdenuit.fr', url: 'https://dungeonvr.codeurdenuit.fr/' }, { text: 'yobox.cd.fr', url: 'https://yobox.codeurdenuit.fr' }],
        position: { pc: new Vector3(3, 0.01, -13), mo: new Vector3(-3, 0.01, -13), vr: new Vector3(3, 0.01, -13) },
        panelPos: { pc: new Vector3(-3.5, 1, 1), mo: new Vector3(-0.2, 1, 2.8), vr: new Vector3(-3.5, 1, 1) },
        backPos: { pc: new Vector3(3.5, -0.95, 1.4), mo: new Vector3(0.7, -1, 0.2), vr: new Vector3(3.5, -0.95, 1.4) },
        lightIntensity:1.5,
        lightDistance: 2.1,
      },
      {
        indexNode: 2,
        mesh: 'room2',
        icon: 'icon-youtube',
        title: wording.rooms[1].title,
        text: wording.rooms[1].text,
        anim: 'youtube',
        button: wording.rooms[1].button,
        vrOnly: false,
        iconColor: 0xd00000,
        colorShape: 0xffffff,
        links: [{ text: 'www.youtube.com/channel/...', url: 'https://www.youtube.com/channel/UCisX035rh3DHUpYR9cBG8bA' }],
        position: { pc: new Vector3(-3, 0.01, -22), mo: new Vector3(3, 0.01, -22), vr: new Vector3(-3, 0.01, -22) },
        panelPos: { pc: new Vector3(3.5, 1, 1), mo: new Vector3(0.4, 1, 2.8), vr: new Vector3(3.5, 1, 1) },
        backPos: { pc: new Vector3(-3.5, -0.95, 1.4), mo: new Vector3(-1, -1, 0.3), vr: new Vector3(-3.5, -0.95, 1.4) },
        lightIntensity:2,
        lightDistance: 2
      },
      {
        indexNode: 3,
        mesh: 'room3',
        icon: 'icon-twitter',
        title: wording.rooms[2].title,
        text: wording.rooms[2].text,
        anim: 'twitter',
        button: wording.rooms[2].button,
        vrOnly: false,
        iconColor: 0x1c9fca,
        colorShape: 0xffffff,
        links: [{ text: 'twitter.com/Codeur_de_nuit', url: 'https://twitter.com/Codeur_de_nuit' }],
        position: { pc: new Vector3(3, 0.01, -31), mo: new Vector3(-3, 0.01, -31), vr: new Vector3(3, 0.01, -31) },
        panelPos: { pc: new Vector3(- 3.5, 1, 1), mo: new Vector3(-0.1, 1, 2.7), vr: new Vector3(- 3.5, 1, 1) },
        backPos: { pc: new Vector3(3.5, -0.95, 1.4), mo: new Vector3(0.7, -1, 0.2), vr: new Vector3(3.5, -0.95, 1.4) },
        lightIntensity:2,
        lightDistance: 4
      },
      {
        indexNode: 4,
        mesh: 'room4',
        icon: 'icon-univers',
        title: wording.rooms[3].title,
        text: wording.rooms[3].text,
        anim: 'playvr',
        button: wording.rooms[3].button,
        vrOnly: true,
        iconColor: 0xb3851f,
        colorShape: 0xffffff,
        position: { pc: new Vector3(-3, 0.01, -40), mo: new Vector3(3, 0.01, -40), vr: new Vector3(-3, 0.01, -40) },
        panelPos: { pc: new Vector3(3.5, 1, 1), mo: new Vector3(0.5, 1, 2.9), vr: new Vector3(3.5, 1, 1) },
        backPos: { pc: new Vector3(-3.5, -0.95, 1.4), mo: new Vector3(-1, -1, 0.3), vr: new Vector3(-3.5, -0.95, 1.4) },
        lightIntensity:1,
        lightDistance: 4
      }
    ]
  }
};
