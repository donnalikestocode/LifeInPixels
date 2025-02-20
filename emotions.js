import { heartThoughtBubbleImage, happyThoughtBubbleImage } from "./assets.js";
import { Sprite } from "./classes.js";
import { c } from "./constants.js";
import { player } from "./player.js";

const heartThoughtBubble = {
  position: {
    x: player.position.x,
    y: player.position.y -64,
  },
  currentSprite: heartThoughtBubbleImage,
  visible: false,
  width: 64,
  height: 64,
};

function drawHeartThoughtBubble() {
  if (!heartThoughtBubble.visible) return;

  c.drawImage(
    heartThoughtBubble.currentSprite,
    0,
    0,
    heartThoughtBubble.width,
    heartThoughtBubble.height,
    heartThoughtBubble.position.x,
    heartThoughtBubble.position.y,
    heartThoughtBubble.width,
    heartThoughtBubble.height,
  );
}

const happyThoughtBubble = {
  position: {
    x: player.position.x,
    y: player.position.y -64,
  },
  currentSprite: happyThoughtBubbleImage,
  visible: false,
  width: 64,
  height: 64,
};

function drawHappyThoughtBubble() {
  if (!happyThoughtBubble.visible) return;

  console.log("drawing happy thought bubble");
  c.drawImage(
    happyThoughtBubble.currentSprite,
    0,
    0,
    happyThoughtBubble.width,
    happyThoughtBubble.height,
    happyThoughtBubble.position.x,
    happyThoughtBubble.position.y,
    happyThoughtBubble.width,
    happyThoughtBubble.height,
  );
}

export { heartThoughtBubble, drawHeartThoughtBubble, happyThoughtBubble, drawHappyThoughtBubble };
