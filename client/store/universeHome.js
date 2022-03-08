import { Vector3 } from 'three';
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
    open: 'en savoir plus',
    description: 'Cliquez pour entrer dans l\'univers Codeur de Nuit.',
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
    infoText : `A travers mes projets, je partage une vision.
    Pour moi, le code est un outil créatif. 
    Entre l'utilité et l'artistique, il permet de créer des univers et des expériences.
    
    J'essaye de développer une communauté afin de partager et trouver du soutien pour mes futurs projets.

    Si vous pensez avoir un projet innovant et créatif (2D, 3D, VR), n'hésitez pas à me contacter par mail ou par twitter. (codeurdenuit@gmail.com)
    Je suis déjà très occupé, mais j'ai plaisir à soutenir les projets en accord avec ma vision.    
    `,
    infoTitle : 'Codeur de nuit',
    infoPosition:  { pc: new Vector3(4.5, 1.75, -9.8), mo: new Vector3(-1.5, 1.75, -9.3), vr: new Vector3(4.5, 1.75, -9.8) },
    infoBackPosition:  { pc: new Vector3( -0.4, -1.74, 0.5), mo: new Vector3( -0.4, -1.74, 0.5), vr: new Vector3(0, -1.74, 1) },
    rooms: [
      {
        indexNode: 1,
        mesh: 'room1',
        icon: 'icon-codeurdenuit',
        title: 'Codeur de nuit',
        text: 'Le code est un moyen d\'expression, une source de créativité sans limite. J\'expérimente ici ce que pourrait donner un site webVR dans le Métavers. Utilisez un Casque VR pour une meilleure expérience',
        anim: 'codeur',
        button: 'En savoir plus',
        vrOnly: false,
        colorShape: 0x000001,
        links: [{ text: 'dungeonvr.codeurdenuit.fr', url: 'https://dungeonvr.codeurdenuit.fr/' }, { text: 'www.yobox.io', url: 'https://www.yobox.io/' }],
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
        title: 'Ma chaîne Youtube',
        text: 'Je présente mes projets, mes expériences techniques et concepts. La chaîne débute, n\'hésitez pas à venir jeter un oeil',
        anim: 'youtube',
        button: 'Entrer',
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
        title: 'Suivez moi sur Twitter',
        text: 'Je communique sur mes projets en cours et à venir. J\'utilise aussi twitter comme moyen de contact.',
        anim: 'twitter',
        button: 'Entrer',
        vrOnly: false,
        iconColor: 0x007FAA,
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
        title: 'Expérimentation',
        text: 'Cette zone n\'est accessible qu\'en VR. N\'hésitez pas à revenir avec votre casque',
        anim: 'playvr',
        button: 'Entrer',
        vrOnly: true,
        iconColor: 0xb3851f,
        colorShape: 0xffffff,
        position: { pc: new Vector3(-3, 0.01, -40), mo: new Vector3(3, 0.01, -40), vr: new Vector3(-3, 0.01, -40) },
        panelPos: { pc: new Vector3(3.5, 1, 1), mo: new Vector3(0.5, 1, 2.9), vr: new Vector3(3.5, 1, 1) },
        backPos: { pc: new Vector3(-3.5, -0.95, 1.4), mo: new Vector3(-1, -1, 0.3), vr: new Vector3(-3.5, -0.95, 1.4) },
        lightIntensity:3,
        lightDistance: 4
      }
    ]
  }
};
