import { Sprite, Boundary } from "./classes.js";
import { kevinImage, lucasImage, gioImage, connieImage, davidImage, meganImage, quynhImage } from "./assets.js";
import { gameState } from "./constants.js";

const npcs = [
  // new Sprite({
  //   position: { x: 2688, y: 0 },
  //   image: kevinImage,
  //   name: "Kevin"
  // }),
  new Sprite({
    position: { x: 960, y: 512 },
    image: lucasImage,
    name: "Lucas"
  }),
  // new Sprite({
  //   position: { x: 512, y: 896 },
  //   image: gioImage,
  //   name: "Gio"
  // }),
  // new Sprite({
  //   position: { x: 1280, y: 768 },
  //   image: connieImage,
  //   name: "Connie"
  // }),
  // new Sprite({
  //   position: {x: 2560, y: 704 },
  //   image: davidImage,
  //   name: "David"
  // }),
  // new Sprite({
  //   position: { x: 1600, y: 1344 },
  //   image: meganImage,
  //   name: "Megan"
  // }),
  // new Sprite({
  //   position: { x: 1408, y: 128 },
  //   image: quynhImage,
  //   name: "Quynh"
  // }),
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

export { npcs };