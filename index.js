import {canvas, c, offset, TILE_SIZE, keys} from "./constants.js";
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

const grid = new Grid();

let activeNpc = null;
let animationStarted = false;

gameState.movables.push(background, ...gameState.boundaries, foreground, extraForegroundObjects, ...npcs, donna)

function animate() {
  if (!animationStarted) {
    animationStarted = true;
  } else {
    return;
  }

  function loop() {

    window.requestAnimationFrame(loop);


    if (gameState.boundariesNeedUpdate) {
      refreshBoundaries();
      gameState.boundariesNeedUpdate = false;
    }

    background.draw();
    grid.draw();
    if (donna.visible) {
      drawDonna();
    }

    gameState.boundaries.forEach((boundary) => boundary.draw())

    activeNpc = getNearbyNpc();
    npcs.forEach(npc => npc.draw());

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

  if (gameState.isDialogueActive) return;
  }

  if (e.key === "b") {

    if (gameState.isMoving) {
      console.log("🚫 Can't switch to bike mode while moving!");
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














