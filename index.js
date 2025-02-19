import {canvas, c, offset, TILE_SIZE} from "./constants.js";
import { gameState } from "./constants.js";
import { Sprite, Boundary } from "./classes.js";
import { player, movePlayer, updateMovementSpeed, updatePlayerSprite } from "./player.js";
import { rectangularCollision } from "./utils.js";
import { donnaUpImage, donnaDownImage, donnaLeftImage, donnaRightImage, donnaBikeUpImage, donnaBikeDownImage, donnaBikeLeftImage, donnaBikeRightImage } from "./assets.js";
import { image, foregroundImage, extraForegroundObjectsImage } from "./assets.js";
import { kevinImage, lucasImage, gioImage, connieImage, davidImage, meganImage, quynhImage } from "./assets.js";

let activeNpc = null;
let currentDialogue = null;

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

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

gameState.worldOffsetX = offset.x;
gameState.worldOffsetY = offset.y;

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

// Initialize all NPCs as "not talked to"
npcs.forEach(npc => {
  gameState.talkedToNPCs[npc.name] = false;
});

gameState.movables.push(background, ...gameState.boundaries, foreground, extraForegroundObjects, ...npcs, donna)

let dialogueIndex = 0;
let animationStarted = false;

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
      // console.log(`📌 NPC ${npc.name} is at X: ${npc.position.x}, Y: ${npc.position.y}`);
      // console.log(`🚶 Perry is at X: ${player.position.x}, Y: ${player.position.y}`);

      npc.draw();

      // Ensure the player is aligned on the correct axis
      const distanceX = Math.abs(npc.position.x - player.position.x);
      const distanceY = Math.abs(npc.position.y - player.position.y);

      // console.log(`📌 Distance X: ${distanceX}, Distance Y: ${distanceY}`);
      // console.log(`🚶 Last key: ${lastKey}`);

      if (
        (distanceX === 64 && distanceY === 0 && (gameState.lastKey === "a" || gameState.lastKey === "d")) ||  // Left/Right detection
        (distanceY === 64 && distanceX === 0 && (gameState.lastKey === "w" || gameState.      lastKey === "s"))    // Up/Down detection
      ) {
        console.log(`📌 NPC ${npc.name} is nearby!`);
        npcNearby = npc;
      }
    });

    // console.log("Nearby NPC detected:", npcNearby);
    activeNpc = npcNearby; // ✅ Update the active NPC
    // console.log("Updated activeNpc:", activeNpc);

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

function handleNpcInteraction(npc) {
  if (!gameState.talkedToNPCs[npc.name]) {
    gameState.talkedToNPCs[npc.name] = true;
    console.log(`✅ Perry talked to ${npc.name}`);

    if (Object.values(gameState.talkedToNPCs).every(Boolean)) {
      console.log("🎉 All NPCs talked to! Donna will now appear...");
      donna.visible = true;

      if (!gameState.donnaBoundaryAdded) {
        gameState.donnaBoundaryAdded = true;
        gameState.boundariesNeedUpdate = true;
        // moveDonna();
      }
      moveDonna();

      // ⏳ Wait 7 seconds, then trigger Perry's realization
      setTimeout(() => {
        startDialogue("PerryHint");
      }, 7000);
    }

  }
}

function advanceDialogue(event) {
  if (event.key === "Enter") {
    dialogueIndex++;

    if (dialogueIndex < currentDialogue.length) {
      document.getElementById("dialogueText").innerText = currentDialogue[dialogueIndex];
    } else {
      // 🎉 End dialogue
      document.getElementById("dialogueBox").classList.add("hidden");
      document.getElementById("dialogueBox").style.display = "none";

      gameState.isDialogueActive = false;
      gameState.freezePerry = false; // ✅ Unfreeze Perry

      // ✅ If Donna's dialogue just ended, WAIT before restarting her movement
      // if (currentDialogue === npcDialogues["Donna"]) {
      //   console.log("⏳ Waiting before restarting Donna's movement...");
      //   setTimeout(() => {
      //     console.log("🔄 Restarting Donna's movement...");
      //     donnaCooldown = false; // Remove cooldown
      //     moveDonna();
      //     donnaFollowing = true;
      //   }, 200); // 🕒 2-second delay before restarting movement
      // }

       // ✅ If Donna’s dialogue just ended, she should start following Perry
       if (currentDialogue === npcDialogues["Donna"]) {
        console.log("✨ Donna is now following Perry!");
        gameState.donnaFollowing = true; // 🔄 Start following after dialogue
      }

      dialogueIndex = 0;
      currentDialogue = null;
    }
  }
}

function startDialogue(npcName) {
  if (!npcDialogues[npcName]) return;

  if (npcName === "Donna") {
    faceEachOtherBeforeDialogue(); // Donna turns to face Perry
  }

  dialogueIndex = 0;
  gameState.isDialogueActive = true;
  gameState.freezePerry = true; // ⛔ Freeze movement

  currentDialogue = npcDialogues[npcName]; // ✅ Track active dialogue

  // ✅ Ensure the dialogue box is fully visible
  const dialogueBox = document.getElementById("dialogueBox");
  dialogueBox.classList.remove("hidden");
  dialogueBox.style.visibility = "visible";
  dialogueBox.style.opacity = "1";
  dialogueBox.style.display = "flex";

  document.getElementById("dialogueText").innerText = currentDialogue[dialogueIndex];
}

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

function moveDonna() {
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

function faceEachOtherBeforeDialogue() {
  // Determine Perry's direction to face Donna
  if (player.position.x < donna.position.x) {
    player.image = player.sprites.right; // Perry faces right
    donna.currentSprite = donnaLeftImage; // Donna faces left
  } else if (player.position.x > donna.position.x) {
    player.image = player.sprites.left; // Perry faces left
    donna.currentSprite = donnaRightImage; // Donna faces right
  } else if (player.position.y < donna.position.y) {
    player.image = player.sprites.down; // Perry faces down
    donna.currentSprite = donnaUpImage; // Donna faces up
  } else if (player.position.y > donna.position.y) {
    player.image = player.sprites.up; // Perry faces up
    donna.currentSprite = donnaDownImage; // Donna faces down
  }
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

// function updateDonnaPosition() {
//   if (!donnaFollowing || perryPreviousPositions.length < 3) return;

//   console.log("🔄 Donna is trying to follow Perry!", perryPreviousPositions);
//   const previousStep = perryPreviousPositions[1]; // Perry's 3-steps-ago position

//   if (!previousStep) return;

//   let moveX = previousStep.x - donna.position.x;
//   let moveY = previousStep.y - donna.position.y;

//   // Move one axis at a time (X first, then Y)
//   if (Math.abs(moveX) > 0) {
//     donna.position.x += Math.sign(moveX) * TILE_SIZE ;
//   } else if (Math.abs(moveY) > 0) {
//     donna.position.y += Math.sign(moveY) * TILE_SIZE ;
//   }

//   // 🎨 **Update Donna's sprite based on Perry's movement**
//   if (bikeMode) {
//     if (lastKey === "w") donna.currentSprite = donnaBikeUpImage;
//     else if (lastKey === "a") donna.currentSprite = donnaBikeLeftImage;
//     else if (lastKey === "s") donna.currentSprite = donnaBikeDownImage;
//     else if (lastKey === "d") donna.currentSprite = donnaBikeRightImage;
//   } else {
//     if (lastKey === "w") donna.currentSprite = donnaUpImage;
//     else if (lastKey === "a") donna.currentSprite = donnaLeftImage;
//     else if (lastKey === "s") donna.currentSprite = donnaDownImage;
//     else if (lastKey === "d") donna.currentSprite = donnaRightImage;
//   }

//   console.log(`✨ Donna moved to: X=${donna.position.x}, Y=${donna.position.y}, Sprite: ${donna.currentSprite.src}`);
// }

function smoothMoveDonna(targetX, targetY) {
  if (donna.moving) return; // Prevent duplicate movement

  donna.moving = true; // Lock movement until finished

  let startX = donna.position.x;
  let startY = donna.position.y;
  let distanceX = targetX - startX;
  let distanceY = targetY - startY;
  let steps = 8; // Adjust for smoothness (higher = slower, lower = faster)
  let stepX = distanceX / steps;
  let stepY = distanceY / steps;
  let stepCount = 0;

  function step() {
    if (stepCount < steps) {
      donna.position.x += stepX;
      donna.position.y += stepY;
      stepCount++;

      // 🎨 **Update Animation Frames**
      if (stepCount % 2 === 0) { // Adjust animation speed
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













