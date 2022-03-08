
import UniverseHome from './scenes/universeHome';
import UniverseTwitter from './scenes/universeTwitter';
import UniverseYoutube from './scenes/universeYoutube';
import UniverseTest from './scenes/universeTest';
import UniverseHomeFake from './scenes/universeHomeFake';
import Metaverse from './components/metaverse';
import store from './store';

window.addEventListener('load', async () => {

  await store.loadMesh('assets.glb');
  store.loadTexture('textureColor.png');
  store.loadTexture('textureLight.png');

  const universeHome = new UniverseHome();
  const universeTwitter = new UniverseTwitter();
  const universeYoutube = new UniverseYoutube();
  const universeTest = new UniverseTest();
  const universeHomeFake = new UniverseHomeFake();

  const metaverse = new Metaverse();

  metaverse.setUniverse(0, universeHome);
  metaverse.setUniverse(1, universeYoutube);
  metaverse.setUniverse(2, universeTwitter);
  metaverse.setUniverse(3, universeTest);
  metaverse.setUniverse(4, universeHomeFake);

  await metaverse.start(store.indexUniverse);
});