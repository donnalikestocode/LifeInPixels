import {canvas, c, offset, TILE_SIZE, keys} from "./constants.js";
import { gameState } from "./constants.js";
import { rectangularCollision } from "./utils.js";
import { Sprite, Boundary } from "./classes.js";
import { player, movePlayer, updateMovementSpeed, updatePlayerSprite } from "./player.js";
import { npcs } from "./npcs.js";
import { handleNpcInteraction } from "./quest.js";
import { startDialogue, advanceDialogue } from "./dialogues.js";
import { donnaUpImage, donnaDownImage, donnaLeftImage, donnaRightImage, donnaBikeUpImage, donnaBikeDownImage, donnaBikeLeftImage, donnaBikeRightImage } from "./assets.js";
import { image, foregroundImage, extraForegroundObjectsImage } from "./assets.js";

let activeNpc = null;
let animationStarted = false;

const collisionsMap = []

for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, i + 70))
}

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 3807) {
      gameState.boundaries.push(
        new Boundary({
          position: {
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y
            }
          })
        )
      }
  })
})

c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

export const donna = {
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

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
});

const extraForegroundObjects = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: extraForegroundObjectsImage,
});

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

let lastMoveTime = 0;
let lastDirectionSwitchTime = performance.now();

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

    // console.log(`📌 activeNpc: ${activeNpc}`);

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

function refreshBoundaries() {
  // console.log("🔄 Refreshing boundaries...");
  // console.log(`📌 Current world offset: x=${worldOffsetX}, y=${worldOffsetY}`);

  gameState.boundaries = [];

  // ✅ Apply worldOffsetX/Y dynamically instead of offset.x/y
  collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol === 3807) {
        gameState.boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width + gameState.worldOffsetX,
              y: i * Boundary.height + gameState.worldOffsetY
            }
          })
        );
      }
    });
  });

  // ✅ Add NPC boundaries dynamically (NO offset needed)
  npcs.forEach(npc => {
    gameState.boundaries.push(new Boundary({
      position: {
        x: npc.position.x,
        y: npc.position.y,
      },
      width: 96,
      height: 96
    }));
  });

  // ✅ Add Donna’s boundary *only if she is visible*
  if (donna.visible) {
    gameState.boundaries.push(new Boundary({
      position: {
        x: donna.position.x,
        y: donna.position.y,
      },
      width: 64,
      height: 64
    }));
  }
  // ✅ Update movables to recognize new boundaries
  gameState.movables = [background, ...gameState.boundaries, foreground, extraForegroundObjects, ...npcs, donna];

  // console.log("✅ Boundaries updated. Total count:", boundaries.length);
}

export function moveDonna() {
  if (!donna.visible || gameState.donnaCooldown) return; // 🛑 Stop if cooldown is active

  console.log("🚀 Moving Donna...");

  const moveAmount = TILE_SIZE / window.MOVEMENT_STEPS;
  let stepProgress = 0
  const maxSteps = TILE_SIZE * 3;

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

    let willCollideWithPerry = rectangularCollision({
      rectangle1: { position: { x: donna.position.x, y: nextY }, width: donna.width, height: donna.height },
      rectangle2: { position: player.position, width: player.width, height: player.height },
    });

    if (!willCollideWithPerry) {
      donna.position.y = nextY;
      stepProgress += moveAmount;

      donna.frameCounter++;
      if (donna.frameCounter % 4 === 0) {
        donna.frameIndex = (donna.frameIndex + 1) % donna.maxFrames;
      }

      donna.currentSprite = donna.direction === -1 ? donnaDownImage : donnaUpImage;

      refreshBoundaries();
    } else {
      console.log("🚫 Donna stopped! Perry is in front of her.");
    }
  }, 150);
}

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

function smoothMoveDonna(targetX, targetY) {
  if (donna.moving) return; // Prevent duplicate movement

  donna.moving = true; // Lock movement until finished

  let startX = donna.position.x;
  let startY = donna.position.y;
  let distanceX = targetX - startX;
  let distanceY = targetY - startY;
  let steps = 16; // Adjust for smoothness (higher = slower, lower = faster)
  let stepX = distanceX / steps;
  let stepY = distanceY / steps;
  let stepCount = 0;

  function step() {
    if (stepCount < steps) {
      donna.position.x += stepX;
      donna.position.y += stepY;
      stepCount++;

      // 🎨 **Update Animation Frames**
      if (stepCount % 4 === 0) { // Adjust animation speed
        donna.frameIndex = (donna.frameIndex + 1) % donna.maxFrames;
      }

      requestAnimationFrame(step);
    } else {
      // 🎯 Snap to the exact grid to prevent drifting
      donna.position.x = targetX;
      donna.position.y = targetY;
      donna.moving = false; // Unlock movement
    }
  }

  requestAnimationFrame(step);
}

export function updateDonnaPositionBasedOnKey(key) {
  if (!gameState.donnaFollowing) return;

  let targetX = donna.position.x;
  let targetY = donna.position.y;

  switch (key) {
    case "w": // Perry moves UP
      if (donna.position.y > player.position.y) targetY -= TILE_SIZE;
      break;
    case "s": // Perry moves DOWN
      if (donna.position.y < player.position.y) targetY += TILE_SIZE;
      break;
    case "a": // Perry moves LEFT
      if (donna.position.x > player.position.x) targetX -= TILE_SIZE;
      break;
    case "d": // Perry moves RIGHT
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

  // ✅ Calculate movement direction (AFTER confirming movement)
  let moveX = targetX - donna.position.x;
  let moveY = targetY - donna.position.y;

  // ✅ Move Donna if there's no collision
  donna.position.x = targetX;
  donna.position.y = targetY;

  // 🎨 **Animate Donna's Frames**
  donna.frameCounter++;

  if (donna.frameCounter % 1 === 0) { // Adjust 10 for animation speed
    donna.frameIndex = (donna.frameIndex + 1) % donna.maxFrames;
  }

  // 🏎 **Check if Perry is in Bike Mode**
  if (gameState.bikeMode) {
    donna.currentSprite =
      moveX > 0 ? donnaBikeRightImage :
      moveX < 0 ? donnaBikeLeftImage :
      moveY > 0 ? donnaBikeDownImage :
      moveY < 0 ? donnaBikeUpImage : donna.currentSprite;
  } else {
    donna.currentSprite =
      moveX > 0 ? donnaRightImage :
      moveX < 0 ? donnaLeftImage :
      moveY > 0 ? donnaDownImage :
      moveY < 0 ? donnaUpImage : donna.currentSprite;
  }
}

// // ✅ Hook into Perry’s movement function
// window.addEventListener("keydown", (e) => {
//   if (!["w", "a", "s", "d"].includes(e.key)) return;

//   setTimeout(() => updateDonnaPositionBasedOnKey(e.key), 1000);
// });













