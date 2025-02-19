import { rectangularCollision } from "./utils.js";
import { canvas, TILE_SIZE, gameState } from "./constants.js";
import { playerDownImage, playerUpImage, playerLeftImage, playerRightImage, playerBikeUpImage, playerBikeDownImage, playerBikeLeftImage, playerBikeRightImage } from "./assets.js";
import { Sprite } from "./classes.js";
import { updateDonnaPositionBasedOnKey } from "./companion.js";


let currentFrame = null;
let perryPreviousPositions = []; // Stores Perry’s past positions
const MAX_TRACKED_POSITIONS = 6; // Keep up to 5 steps

export const player = new Sprite({
  position: {
    x: Math.floor(canvas.width / 2 / 64) * 64,  // Force grid alignment
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

  // console.log(`🚶 Moving player in direction: ${direction}`);
  if (gameState.isDialogueActive || gameState.isMoving|| gameState.freezePerry) return;

  // 🔄 Update movement speed based on bike mode dynamically
  window.MOVEMENT_STEPS = gameState.bikeMode ? 8 : 16;

  // 🚨 **FORCE INSTANT SWITCHING**
  if (gameState.isMoving && direction !== gameState.lastKey) {
    cancelAnimationFrame(currentFrame);

    gameState.isMoving = false;  // ✅ Stop current movement
    gameState.queuedDirection = null;
    gameState.lastKey = direction;

    // 🚀 **Immediately start new movement**
    return movePlayer(direction);
  }

  gameState.isMoving = true;
  player.moving = true;
  gameState.lastKey = direction;
  gameState.stepProgress = 0;

  // console.log(`This is the last key: ${lastKey}`);

  let moveX = 0, moveY = 0;
  switch (direction) {
    case "w": player.image = gameState.bikeMode ? player.sprites.bikeUp : player.sprites.up; moveY = -TILE_SIZE; break;
    case "a": player.image = gameState.bikeMode ? player.sprites.bikeLeft : player.sprites.left; moveX = -TILE_SIZE; break;
    case "s": player.image = gameState.bikeMode ? player.sprites.bikeDown : player.sprites.down; moveY = TILE_SIZE; break;
    case "d": player.image = gameState.bikeMode ? player.sprites.bikeRight : player.sprites.right; moveX = TILE_SIZE; break;
}

  // Check for collision
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
    // console.log("🚧 Collision detected! Stopping movement.");
    gameState.isMoving = false;
    player.moving = false;
    return;
  }

  // ✅ Store Perry’s last position before moving
  perryPreviousPositions.unshift({ x: player.position.x, y: player.position.y });

  // ✅ Keep position history limited to prevent lag
  if (perryPreviousPositions.length > MAX_TRACKED_POSITIONS) {
    perryPreviousPositions.pop();
  }

  // **Reduce movement steps to make direction switching feel instant**
  let adjustedSteps = window.MOVEMENT_STEPS;
  let stepSizeX = moveX / adjustedSteps;
  let stepSizeY = moveY / adjustedSteps;

  function stepMove() {
    if (gameState.stepProgress < adjustedSteps) {
      gameState.movables.forEach(movable => {
        movable.position.x -= stepSizeX;
        movable.position.y -= stepSizeY;
      });

      gameState.worldOffsetX -= stepSizeX;
      gameState.worldOffsetY -= stepSizeY;

      gameState.stepProgress++;

      currentFrame = requestAnimationFrame(stepMove);
    } else {

      gameState.isMoving = false;
      player.moving = false;

    // ✅ Only update Donna's position **after Perry has fully moved**
    if (gameState.donnaFollowing && gameState.lastKey) {
      updateDonnaPositionBasedOnKey(gameState.lastKey);
    }

      if (gameState.queuedDirection) {
        movePlayer(gameState.queuedDirection);
        gameState.queuedDirection = null;
      }

    }
  }

  requestAnimationFrame(stepMove);
}

export function updateMovementSpeed() {
  window.MOVEMENT_STEPS = gameState.bikeMode ? 8 : 16;
}

export function updatePlayerSprite() {
  // ✅ **Ensure lastKey is valid, default to standing "Down"**
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

  let spriteKey = directionMap[gameState.lastKey] || "Down"; // Default to "Down"

  // ✅ **Ensure correct sprite mode (bike or walk)**
  let standingSprite = gameState.bikeMode
    ? player.sprites[`bike${spriteKey}`] // 🚲 Use bike sprite if biking
    : player.sprites[spriteKey.toLowerCase()]; // 🚶 Use walking sprite if walking

  if (standingSprite) {
    player.image = standingSprite; // ✅ Instantly update the player's sprite
  } else {
    console.error(`🚨 Missing sprite for lastKey: ${gameState.lastKey} (mapped: ${spriteKey})`); // Debugging
  }
}