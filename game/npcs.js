import { Sprite, Boundary } from "./classes.js";
import { kevinImage, lucasImage, gioImage, connieImage, davidImage, meganImage, quynhImage} from "./assets.js";
import { TILE_SIZE, gameState } from "./constants.js";
import { player } from "./player.js";

const npcs = [
  new Sprite({
    position: { x: 2688, y: 0 },
    image: kevinImage,
    name: "Kevin"
  }),
  new Sprite({
    position: { x: 960, y: 512 },
    image: lucasImage,
    name: "Lucas"
  }),
  new Sprite({
    position: { x: 512, y: 896 },
    image: gioImage,
    name: "Gio"
  }),
  new Sprite({
    position: { x: 1280, y: 768 },
    image: connieImage,
    name: "Connie"
  }),
  new Sprite({
    position: {x: 640, y: -256 },
    image: davidImage,
    name: "David"
  }),
  new Sprite({
    position: { x: 1600, y: 1344 },
    image: meganImage,
    name: "Megan"
  }),
  new Sprite({
    position: { x: 1408, y: 128 },
    image: quynhImage,
    name: "Quynh"
  }),
];

npcs.forEach(npc => {
  gameState.boundaries.push(
    new Boundary({
      position: {
        x: npc.position.x,
        y: npc.position.y
      },
      width: 96,
      height: 96
    })
  );
});

npcs.forEach(npc => {
  gameState.talkedToNPCs[npc.name] = false;
});

function getNearbyNpc() {
  let npcNearby = null;

  npcs.forEach(npc => {
    const distanceX = Math.abs(npc.position.x - player.position.x);
    const distanceY = Math.abs(npc.position.y - player.position.y);

    if (
      (distanceX === TILE_SIZE && distanceY === 0 && (gameState.lastKey === "a" || gameState.lastKey === "d")) ||
      (distanceY === TILE_SIZE && distanceX === 0 && (gameState.lastKey === "w" || gameState.lastKey === "s"))
    ) {
      npcNearby = npc;
    }
  });

  return npcNearby;
}

export { npcs, getNearbyNpc };