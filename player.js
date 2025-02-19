import { rectangularCollision } from "./utils.js";
import { canvas, TILE_SIZE, gameState } from "./constants.js";
import { playerDownImage, playerUpImage, playerLeftImage, playerRightImage, playerBikeUpImage, playerBikeDownImage, playerBikeLeftImage, playerBikeRightImage } from "./assets.js";
import { Sprite } from "./classes.js";

let currentFrame = null;

export const player = new Sprite({
  position: {
    x: Math.floor(canvas.width / 2 / 64) * 64,
    y: Math.floor(canvas.height / 2 / 64) * 64,
  },
  image: playerDownImage,
  frames: {
    max: 4
  },
  sprites: {
    up: playerUpImage,
    down: playerDownImage,
    left: playerLeftImage,
    right: playerRightImage,
    bikeUp: playerBikeUpImage,
    bikeDown: playerBikeDownImage,
    bikeLeft: playerBikeLeftImage,
    bikeRight: playerBikeRightImage,
  },
  name:"Perry"
})

export function movePlayer(direction) {

  if (gameState.isDialogueActive || gameState.isMoving|| gameState.freezePerry) return;

  gameState.MOVEMENT_STEPS = gameState.bikeMode ? 16 : 32;

  // Force instant switching when changing directions
  if (gameState.isMoving && direction !== gameState.lastKey) {
    cancelAnimationFrame(currentFrame);

    gameState.isMoving = false;
    gameState.queuedDirection = null;
    gameState.lastKey = direction;

    // Immediately start new movement
    return movePlayer(direction);
  }

  gameState.isMoving = true;
  // player.moving = true;
  gameState.lastKey = direction;
  gameState.stepProgress = 0;

  let moveX = 0, moveY = 0;
  switch (direction) {
    case "w": player.image = gameState.bikeMode ? player.sprites.bikeUp : player.sprites.up; moveY = -TILE_SIZE; break;
    case "a": player.image = gameState.bikeMode ? player.sprites.bikeLeft : player.sprites.left; moveX = -TILE_SIZE; break;
    case "s": player.image = gameState.bikeMode ? player.sprites.bikeDown : player.sprites.down; moveY = TILE_SIZE; break;
    case "d": player.image = gameState.bikeMode ? player.sprites.bikeRight : player.sprites.right; moveX = TILE_SIZE; break;
}

  let willCollide = gameState.boundaries.some(boundary => {

    const collisionDetected = rectangularCollision({
      rectangle1: {
        position: { x: player.position.x + moveX, y: player.position.y + moveY },
        width: player.width,
        height: player.height
      },
      rectangle2: boundary
    });

    return collisionDetected;
  });

  if (willCollide) {
    gameState.isMoving = false;
    player.moving = false;
    return;
  }

  // Store move steps, but actual movement happens in `animate()`
  gameState.moveX = moveX / gameState.MOVEMENT_STEPS;
  gameState.moveY = moveY / gameState.MOVEMENT_STEPS;
  gameState.stepProgress = 0;

  console.log(`🔄 Move Step: ${gameState.moveX}, ${gameState.moveY}`);
  console.log(`🚀 Moving ${direction} by ${moveX}, ${moveY}`);
  console.log(`🔢 Steps Remaining: ${gameState.stepProgress}/${gameState.MOVEMENT_STEPS}`);

  // **Reduce movement steps to make direction switching feel instant**
  // let adjustedSteps = window.MOVEMENT_STEPS;
  // let stepSizeX = moveX / adjustedSteps;
  // let stepSizeY = moveY / adjustedSteps;

  // function stepMove() {
  //   if (gameState.stepProgress < adjustedSteps) {
  //     gameState.movables.forEach(movable => {
  //       movable.position.x -= stepSizeX;
  //       movable.position.y -= stepSizeY;
  //     });

  //     gameState.worldOffsetX -= stepSizeX;
  //     gameState.worldOffsetY -= stepSizeY;

  //     gameState.stepProgress++;

  //     currentFrame = requestAnimationFrame(stepMove);
  //   } else {

  //     gameState.isMoving = false;
  //     player.moving = false;

  //     if (gameState.donnaFollowing && gameState.lastKey) {
  //       updateDonnaPositionBasedOnKey(gameState.lastKey);
  //     }

  //     if (gameState.queuedDirection) {
  //       movePlayer(gameState.queuedDirection);
  //       gameState.queuedDirection = null;
  //     }

  //   }
  // }

  // requestAnimationFrame(stepMove);
}

export function updateMovementSpeed() {
  gameState.MOVEMENT_STEPS = gameState.bikeMode ? 8 : 16;
}

export function updatePlayerSprite() {
  // Ensure lastKey is valid, default to standing "Down"
  if (!gameState.lastKey || !["w", "a", "s", "d"].includes(gameState.lastKey)) {
    gameState.lastKey = "s";
  }

  // Map key inputs to correct sprite names
  const directionMap = {
    w: "Up",
    a: "Left",
    s: "Down",
    d: "Right",
  };

  let spriteKey = directionMap[gameState.lastKey] || "Down";

  // Ensure correct sprite mode (bike or walk)
  let standingSprite = gameState.bikeMode
    ? player.sprites[`bike${spriteKey}`]
    : player.sprites[spriteKey.toLowerCase()];

  if (standingSprite) {
    player.image = standingSprite;
  } else {
    console.error(`🚨 Missing sprite for lastKey: ${gameState.lastKey} (mapped: ${spriteKey})`);
  }
}