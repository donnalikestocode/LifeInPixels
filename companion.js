import { donnaUpImage, donnaDownImage, donnaLeftImage, donnaRightImage, donnaBikeUpImage, donnaBikeDownImage, donnaBikeLeftImage, donnaBikeRightImage } from "./assets.js";
import { gameState } from "./constants.js";
import { c, TILE_SIZE } from "./constants.js";
import { player } from "./player.js";
import { startDialogue } from "./dialogues.js";
import { rectangularCollision } from "./utils.js";
import { refreshBoundaries } from "./boundaries.js";

const donna = {
  position: { x: 2880, y: 704 }, // Start position
  width: 64, // Adjust if needed
  height: 64,
  direction: -1, // -1 = up, 1 = down
  moving: false,
  currentSprite: donnaDownImage,
  frameIndex: 0, // Track animation frame
  frameCounter: 0, // Slow down animation speed
  maxFrames: 4, // Total frames in sprite sheet
  visible: false,
};

function drawDonna() {
  if (!donna.visible) return;

  c.drawImage(
    donna.currentSprite,
    donna.frameIndex * donna.width, // Offset to get the correct frame
    0,
    donna.width,
    donna.height,
    donna.position.x,
    donna.position.y,
    donna.width,
    donna.height
  );
}

function moveDonna() {
  if (!donna.visible || gameState.donnaCooldown || gameState.donnaMoving) return;

  console.log("🚀 Moving Donna...");

  // const moveAmount = TILE_SIZE/16;
  const moveAmount = TILE_SIZE/gameState.MOVEMENT_STEPS;
  let stepProgress = 0
  const maxSteps = TILE_SIZE *3;

  const interval = setInterval(() => {
    if (stepProgress >= maxSteps) {
      donna.direction *= -1;
      stepProgress = 0;
    }

    let nextY = donna.position.y - moveAmount * donna.direction;

    // 🛑 **Check if Perry is near Donna, but only if cooldown is inactive**
    if (!gameState.donnaCooldown) {
      const perryNearDonna =
        (Math.abs(player.position.x - donna.position.x) === TILE_SIZE &&
          player.position.y === donna.position.y) ||
        (Math.abs(player.position.y - donna.position.y) === TILE_SIZE &&
          player.position.x === donna.position.x);

      if (perryNearDonna) {
        console.log("🚨 Perry is near Donna! Stopping her movement.");

        donna.position.y = Math.round(donna.position.y / TILE_SIZE) * TILE_SIZE;
        donna.position.x = Math.round(donna.position.x / TILE_SIZE) * TILE_SIZE;

        // ✅ **Activate cooldown BEFORE starting dialogue**
        gameState.donnaCooldown = true;

        startDialogue("Donna");

        clearInterval(interval); // ⛔ Stop Donna's movement
        return;
      }
    }

    donna.position.y = nextY;
    stepProgress += moveAmount;

    donna.frameCounter++;
    if (donna.frameCounter % 2 === 0) {
      console.log("🔄 Donna frame index: ", donna.frameCounter);
      donna.frameIndex = (donna.frameIndex + 1) % donna.maxFrames;
    }

    donna.currentSprite = donna.direction === -1 ? donnaDownImage : donnaUpImage;

    refreshBoundaries();

  }, 150);
}

function updateDonnaPositionBasedOnKey(key) {
  if (!gameState.donnaFollowing || gameState.donnaMoving) return;

  let targetX = donna.position.x;
  let targetY = donna.position.y;

  switch (key) {
    case "w":
      if (donna.position.y > player.position.y) targetY -= TILE_SIZE;
      break;
    case "s":
      if (donna.position.y < player.position.y) targetY += TILE_SIZE;
      break;
    case "a":
      if (donna.position.x > player.position.x) targetX -= TILE_SIZE;
      break;
    case "d":
      if (donna.position.x < player.position.x) targetX += TILE_SIZE;
      break;
  }

  // 🛑 **Collision Detection Before Moving**
  let willCollide = gameState.boundaries.some(boundary => {
    return rectangularCollision({
      rectangle1: { position: { x: targetX, y: targetY }, width: TILE_SIZE, height: TILE_SIZE },
      rectangle2: boundary
    });
  });

  if (willCollide) {
    console.log("🚧 Donna hit a wall! Stopping.");
    return; // 🚫 Stop movement
  }

  // 🚨 **Prevent Overlap with Perry**
  if (targetX === player.position.x && targetY === player.position.y) {
    console.log("🚨 Overlap detected! Adjusting Donna's position.");
    return;
  }

  // ✅ Store movement direction & steps for smooth movement in `animate()`
  gameState.donnaMoveX = (targetX - donna.position.x) / gameState.MOVEMENT_STEPS;
  gameState.donnaMoveY = (targetY - donna.position.y) / gameState.MOVEMENT_STEPS;
  gameState.donnaStepProgress = 0;
  gameState.donnaMoving = true; // ✅ Start moving Donna
}

export { donna,drawDonna, moveDonna, updateDonnaPositionBasedOnKey };