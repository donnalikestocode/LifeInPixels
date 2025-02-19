import {canvas, c, offset, keys} from "./constants.js";
import { gameState } from "./constants.js";
import { rectangularCollision } from "./utils.js";
import { Sprite, Boundary } from "./classes.js";
import { player, movePlayer, updateMovementSpeed, updatePlayerSprite } from "./player.js";
import { npcs, getNearbyNpc } from "./npcs.js";
import { handleNpcInteraction } from "./quest.js";
import { startDialogue, advanceDialogue } from "./dialogues.js";
import { image, foregroundImage, extraForegroundObjectsImage } from "./assets.js";
import { donna, drawDonna } from "./companion.js";
import { refreshBoundaries } from "./boundaries.js";
import { background, foreground, extraForegroundObjects } from "./map.js";
import { Grid } from "./grid.js";
import { updateDonnaPositionBasedOnKey } from "./companion.js";
import { thoughtBubble, drawThoughtBubble } from "./quest.js";

const grid = new Grid();

let activeNpc = null;
let animationStarted = false;

gameState.movables.push(background, ...gameState.boundaries, foreground, extraForegroundObjects, ...npcs, donna)

function animate() {

  // draw them in the layer order (first = first layer)
  window.requestAnimationFrame(animate);

  background.draw();
  gameState.boundaries.forEach((boundary) => boundary.draw())
  grid.draw();
  activeNpc = getNearbyNpc();
  npcs.forEach(npc => npc.draw());

  if (gameState.isMoving) {

    gameState.movables.forEach(movable => {
      movable.position.x -= gameState.moveX;
      movable.position.y -= gameState.moveY;
    });

    gameState.worldOffsetX -= gameState.moveX;
    gameState.worldOffsetY -= gameState.moveY;

    gameState.stepProgress++;

    // Update animation frame every few steps (slows down animation speed)
    if (gameState.stepProgress % Math.round(gameState.MOVEMENT_STEPS ) === 0) {
      player.frames.val = (player.frames.val + 1) % player.frames.max;
    }

    if (gameState.stepProgress >= gameState.MOVEMENT_STEPS) {
      gameState.isMoving = false;

      // 🏃 **Update Donna's movement**
      if (gameState.donnaFollowing) updateDonnaPositionBasedOnKey(gameState.lastKey);

      // 🔄 **Handle queued movement (for smoother direction changes)**
      if (gameState.queuedDirection) {
        movePlayer(gameState.queuedDirection);
        gameState.queuedDirection = null;
      }
    }
  }

  player.draw();

  if (gameState.donnaMoving) {
    donna.position.x += gameState.donnaMoveX;
    donna.position.y += gameState.donnaMoveY;
    gameState.donnaStepProgress++;

    if (gameState.donnaStepProgress % 16 === 0) {
      donna.frameIndex = (donna.frameIndex + 1) % donna.maxFrames;
    }

    if (gameState.donnaStepProgress >= gameState.MOVEMENT_STEPS) {
      gameState.donnaMoving = false;
      gameState.donnaStepProgress = 0;

      // ✅ Ensure Donna finishes a tile before switching modes
      if (gameState.pendingBikeModeChange) {
        gameState.bikeMode = gameState.pendingBikeModeChange;
        updateMovementSpeed();
        updatePlayerSprite();
        gameState.pendingBikeModeChange = null; // Clear pending mode change
      }
    }
  }

  if (donna.visible) {
    drawDonna();
  }

  if (thoughtBubble?.visible) {
    console.log("drawing thought bubble");
    drawThoughtBubble();
  }

  if (gameState.isDialogueActive) return;

  foreground.draw();
  extraForegroundObjects.draw();
}

animate()

window.addEventListener("keydown", (e) => {

  if(gameState.isDialogueActive) {
    advanceDialogue(e);
    return;
  }

  if (e.key === "Enter" && activeNpc) {
    if (gameState.bikeMode) {
      gameState.bikeMode = false;
      updateMovementSpeed();
      updatePlayerSprite();
    }

    handleNpcInteraction(activeNpc);
    startDialogue(activeNpc.name);
    return;
  }

  if (e.key === "b") {
    if (gameState.isMoving || gameState.donnaMoving) {
      console.log("🚫 Cannot switch bike mode while moving! Queuing change.");
      gameState.pendingBikeModeChange = !gameState.bikeMode; // Store change request
      return;
    }
    gameState.bikeMode = !gameState.bikeMode;
    updateMovementSpeed();
    updatePlayerSprite();
    return;
  }

  if (gameState.isMoving) {
    if (!gameState.queuedDirection) gameState.queuedDirection = e.key;
    return;
  }

  movePlayer(e.key);
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});














