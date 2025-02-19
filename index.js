import {canvas, c, offset, TILE_SIZE, keys} from "./constants.js";
import { gameState } from "./constants.js";
import { rectangularCollision } from "./utils.js";
import { Sprite, Boundary } from "./classes.js";
import { player, movePlayer, updateMovementSpeed, updatePlayerSprite } from "./player.js";
import { npcs } from "./npcs.js";
import { handleNpcInteraction } from "./quest.js";
import { startDialogue, advanceDialogue } from "./dialogues.js";
import { image, foregroundImage, extraForegroundObjectsImage } from "./assets.js";
import { donna, drawDonna } from "./companion.js";
import { refreshBoundaries } from "./boundaries.js";
import { background, foreground, extraForegroundObjects } from "./map.js";

let activeNpc = null;
let animationStarted = false;

gameState.worldOffsetX = offset.x;
gameState.worldOffsetY = offset.y;

gameState.movables.push(background, ...gameState.boundaries, foreground, extraForegroundObjects, ...npcs, donna)

function animate() {
  if (!animationStarted) {
    animationStarted = true;
  } else {
    return; // ⛔ Stop extra calls
  }

  function loop() {

    window.requestAnimationFrame(loop);

    // ✅ Refresh boundaries *only if needed*
    if (gameState.boundariesNeedUpdate) {
      refreshBoundaries();
      gameState.boundariesNeedUpdate = false;  // Reset the flag
    }

    background.draw();
    // grid.draw();
    if (donna.visible) {
      drawDonna();
    }

    gameState.boundaries.forEach((boundary) => boundary.draw())

    // NPC detection and drawing
    let npcNearby = null;

    npcs.forEach(npc => {

      npc.draw();

      // Ensure the player is aligned on the correct axis
      const distanceX = Math.abs(npc.position.x - player.position.x);
      const distanceY = Math.abs(npc.position.y - player.position.y);

      if (
        (distanceX === 64 && distanceY === 0 && (gameState.lastKey === "a" || gameState.lastKey === "d")) ||
        (distanceY === 64 && distanceX === 0 && (gameState.lastKey === "w" || gameState.lastKey === "s"))
      ) {
        npcNearby = npc;
      }
    });

    activeNpc = npcNearby;

    player.draw();
    foreground.draw();
    extraForegroundObjects.draw();

    if (gameState.isDialogueActive) return;
  }
  loop()
}

animate()

window.addEventListener("keydown", (e) => {
  console.log(`🔍 Keydown detected: ${e.key}`);

  if(gameState.isDialogueActive) {
    advanceDialogue(e);
    return;
  }

  if (e.key === "Enter") {
    console.log(`📌 isDialogueActive: ${gameState.isDialogueActive}, isMoving: ${gameState.isMoving}, freezePerry: ${gameState.freezePerry}`);

    if (gameState.isDialogueActive) {
      advanceDialogue(e); // ✅ Route all dialogue handling to a single function
      return; // ⛔ Prevent other actions during dialogue
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

  if (gameState.isDialogueActive) return; // ⛔ Block movement during dialogue
  }

  if (e.key === "b") {

    if (gameState.isMoving) {
      console.log("🚫 Can't switch to bike mode while moving!");
      return; // Ignore if player is moving
    }

    gameState.bikeMode = !gameState.bikeMode;
    updateMovementSpeed();
    updatePlayerSprite(); // 🔄 Instantly switch to correct standing frame
    return;
  }

  // Movement Handling
  if (gameState.isMoving) {
    if (!gameState.queuedDirection) gameState.queuedDirection = e.key;  // ✅ **Queue only if empty**
    return;
  }

  movePlayer(e.key);

  if (e.key === "b") {
    gameState.bikeMode = !gameState.bikeMode;
    updateMovementSpeed();
    updatePlayerSprite();
  }

    if (!gameState.isMoving) {
    movePlayer(e.key);
  } else if (!gameState.queuedDirection) {
    gameState.queuedDirection = e.key;
  }

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














