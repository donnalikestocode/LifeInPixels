const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const TILE_SIZE = 64;

let donnaMovementInterval = null; // Track Donna's movement loop

window.gameState = {
  bikeMode: false,
  talkedToNPCs: {},
  freezePerry: false,
  donnaBoundaryAdded: false,
  boundariesNeedUpdate: false,
  donnaCooldown: false,
  donnaFollowing: false,
};

function updateMovementSpeed() {
  window.MOVEMENT_STEPS = window.gameState.bikeMode ? 8 : 16;
}

function updatePlayerSprite() {
  // ✅ **Ensure lastKey is valid, default to standing "Down"**
  if (!lastKey || !["w", "a", "s", "d"].includes(lastKey)) {
    lastKey = "s";
  }

  // Map key inputs to correct sprite names
  const directionMap = {
    w: "Up",
    a: "Left",
    s: "Down",
    d: "Right",
  };

  let spriteKey = directionMap[lastKey] || "Down"; // Default to "Down"

  // ✅ **Ensure correct sprite mode (bike or walk)**
  let standingSprite = window.gameState.bikeMode
    ? player.sprites[`bike${spriteKey}`] // 🚲 Use bike sprite if biking
    : player.sprites[spriteKey.toLowerCase()]; // 🚶 Use walking sprite if walking

  if (standingSprite) {
    player.image = standingSprite; // ✅ Instantly update the player's sprite
  } else {
    console.error(`🚨 Missing sprite for lastKey: ${lastKey} (mapped: ${spriteKey})`); // Debugging
  }
}

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, i + 70))
}

let boundaries = []

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 3807) {
      boundaries.push(
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

const image = new Image();
image.src = "./img/Perry_UCSB_Vday.png";

const foregroundImage = new Image();
foregroundImage.src = "./img/foregroundObjects.png";

const extraForegroundObjectsImage = new Image();
extraForegroundObjectsImage.src = "./img/extraForegroundObjects.png";

const playerDownImage = new Image();
playerDownImage.src = "./img/Perry_playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "./img/Perry_playerUp.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./img/Perry_playerLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "./img/Perry_playerRight.png";

const playerBikeUpImage = new Image();
playerBikeUpImage.src = "./img/Bike/Perry_bikeUp.png";

const playerBikeDownImage = new Image();
  playerBikeDownImage.src = "./img/Bike/Perry_bikeDown.png";

const playerBikeLeftImage = new Image();
playerBikeLeftImage.src = "./img/Bike/Perry_bikeLeft.png";

const playerBikeRightImage = new Image();
playerBikeRightImage.src = "./img/Bike/Perry_bikeRight.png";

const donnaUpImage = new Image();
donnaUpImage.src = "./img/Donna/Donna_up.png";

const donnaDownImage = new Image();
donnaDownImage.src = "./img/Donna/Donna_down.png";

const donnaLeftImage = new Image();
donnaLeftImage.src = "./img/Donna/Donna_left.png";

const donnaRightImage = new Image();
donnaRightImage.src = "./img/Donna/Donna_right.png";

const donnaBikeUpImage = new Image();
donnaBikeUpImage.src = "./img/Donna/Donna_bikeUp.png";

const donnaBikeDownImage = new Image();
donnaBikeDownImage.src = "./img/Donna/Donna_bikeDown.png";

const donnaBikeLeftImage = new Image();
donnaBikeLeftImage.src = "./img/Donna/Donna_bikeLeft.png";

const donnaBikeRightImage = new Image();
donnaBikeRightImage.src = "./img/Donna/Donna_bikeRight.png";

const kevinImage = new Image();
kevinImage.src = "./img/NPCs/Kevin.png";

const lucasImage = new Image();
lucasImage.src = "./img/NPCs/Lucas.png";

const gioImage = new Image();
gioImage.src = "./img/NPCs/Gio.png";

const connieImage = new Image();
connieImage.src = "./img/NPCs/Connie.png";

const davidImage = new Image();
davidImage.src = "./img/NPCs/David.png";

const meganImage = new Image();
meganImage.src = "./img/NPCs/Megan.png";

const quynhImage = new Image();
quynhImage.src = "./img/NPCs/Quynh.png";

const player = new Sprite({
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

donna = {
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

let worldOffsetX = offset.x;
let worldOffsetY = offset.y;

npcs.forEach(npc => {
  boundaries.push(
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
  window.gameState.talkedToNPCs[npc.name] = false;
});

let movables = [background, ...boundaries, foreground, extraForegroundObjects, ...npcs, donna]

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x < rectangle2.position.x + rectangle2.width &&
    rectangle1.position.x + rectangle1.width > rectangle2.position.x &&
    rectangle1.position.y < rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height > rectangle2.position.y
  );
}

let dialogueIndex = 0;
let isDialogueActive = false;
let lastKey = "";
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
    if (window.gameState.boundariesNeedUpdate) {
      refreshBoundaries();
      window.gameState.boundariesNeedUpdate = false;  // Reset the flag
    }

    background.draw();
    grid.draw();
    if (donna.visible) {
      drawDonna();
    }

    boundaries.forEach((boundary) => boundary.draw())

    // NPC detection and drawing
    let npcNearby = null;
    npcs.forEach(npc => {
      npc.draw();

      // Ensure the player is aligned on the correct axis
      const distanceX = Math.abs(npc.position.x - player.position.x);
      const distanceY = Math.abs(npc.position.y - player.position.y);

      if (
        (distanceX === 64 && distanceY === 0 && (lastKey === "a" || lastKey === "d")) ||  // Left/Right detection
        (distanceY === 64 && distanceX === 0 && (lastKey === "w" || lastKey === "s"))    // Up/Down detection
      ) {
        npcNearby = npc;
      }
    });

    activeNpc = npcNearby; // Update the active NPC

    player.draw();
    foreground.draw();
    extraForegroundObjects.draw();

    if (isDialogueActive) return;
  }
  loop()
}

animate()

let isMoving = false;
let queuedDirection = null;
let stepProgress = 0;
let currentFrame = null;
let perryPreviousPositions = []; // Stores Perry’s past positions
const MAX_TRACKED_POSITIONS = 6; // Keep up to 5 steps

let lastMoveTime = 0;
let lastDirectionSwitchTime = performance.now();

function movePlayer(direction) {
  if (isDialogueActive || isMoving|| window.gameState.freezePerry) return;

  // 🔄 Update movement speed based on bike mode dynamically
  window.MOVEMENT_STEPS = window.gameState.bikeMode ? 8 : 16;

  // 🚨 **FORCE INSTANT SWITCHING**
  if (isMoving && direction !== lastKey) {
    cancelAnimationFrame(currentFrame);

    isMoving = false;  // ✅ Stop current movement
    queuedDirection = null;
    lastKey = direction;

    // 🚀 **Immediately start new movement**
    return movePlayer(direction);
  }

  isMoving = true;
  player.moving = true;
  lastKey = direction;
  stepProgress = 0;

  let moveX = 0, moveY = 0;
  switch (direction) {
    case "w": player.image = window.gameState.bikeMode ? player.sprites.bikeUp : player.sprites.up; moveY = -TILE_SIZE; break;
    case "a": player.image = window.gameState.bikeMode ? player.sprites.bikeLeft : player.sprites.left; moveX = -TILE_SIZE; break;
    case "s": player.image = window.gameState.bikeMode ? player.sprites.bikeDown : player.sprites.down; moveY = TILE_SIZE; break;
    case "d": player.image = window.gameState.bikeMode ? player.sprites.bikeRight : player.sprites.right; moveX = TILE_SIZE; break;
}

  // Check for collision
  let willCollide = boundaries.some(boundary => {

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
    isMoving = false;
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
    if (stepProgress < adjustedSteps) {
      movables.forEach(movable => {
        movable.position.x -= stepSizeX;
        movable.position.y -= stepSizeY;
      });

      worldOffsetX -= stepSizeX;
      worldOffsetY -= stepSizeY;

      stepProgress++;

      currentFrame = requestAnimationFrame(stepMove);
    } else {

      isMoving = false;
      player.moving = false;

    // ✅ Only update Donna's position **after Perry has fully moved**
    if (window.gameState.donnaFollowing && lastKey) {
      updateDonnaPositionBasedOnKey(lastKey);
    }



      if (queuedDirection) {
        movePlayer(queuedDirection);
        queuedDirection = null;
      }

    }
  }

  requestAnimationFrame(stepMove);
}

window.addEventListener("keydown", (e) => {
  if(isDialogueActive) {
    advanceDialogue(e);
    return;
  }

  if (e.key === "Enter") {
    if (isDialogueActive) {
      advanceDialogue(e); // ✅ Route all dialogue handling to a single function
      return; // ⛔ Prevent other actions during dialogue
    }

    if (e.key === "Enter" && activeNpc) {
      if (window.gameState.bikeMode) {
        window.gameState.bikeMode = false;
        updateMovementSpeed();
        updatePlayerSprite(); // 🔄 Switch back to walking sprite
      }

      handleNpcInteraction(activeNpc);

      startDialogue(activeNpc.name); // ✅ Use function instead of duplicating logic
      return;
    }

  if (isDialogueActive) return; // ⛔ Block movement during dialogue
  }

  if (e.key === "b") {

    if (isMoving) {
      console.log("🚫 Can't switch to bike mode while moving!");
      return; // Ignore if player is moving
    }

    window.gameState.bikeMode = !window.gameState.bikeMode;
    updateMovementSpeed();
    updatePlayerSprite(); // 🔄 Instantly switch to correct standing frame
    return;
  }

  // Movement Handling
  if (isMoving) {
    if (!queuedDirection) queuedDirection = e.key;  // ✅ **Queue only if empty**
    return;
  }

  movePlayer(e.key);

  if (e.key === "b") {
    window.gameState.bikeMode = !window.gameState.bikeMode;
    updateMovementSpeed();
    updatePlayerSprite();
  }

    if (!isMoving) {
    movePlayer(e.key);
  } else if (!queuedDirection) {
    queuedDirection = e.key;
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
  if (!window.gameState.talkedToNPCs[npc.name]) {
    window.gameState.talkedToNPCs[npc.name] = true;
    console.log(`✅ Perry talked to ${npc.name}`);

    if (Object.values(window.gameState.talkedToNPCs).every(Boolean)) {
      console.log("🎉 All NPCs talked to! Donna will now appear...");
      donna.visible = true;

      if (!window.gameState.donnaBoundaryAdded) {
        window.gameState.donnaBoundaryAdded = true;
        window.gameState.boundariesNeedUpdate = true;
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

      isDialogueActive = false;
      window.gameState.freezePerry = false; // ✅ Unfreeze Perry

      // ✅ If Donna's dialogue just ended, WAIT before restarting her movement
      // if (currentDialogue === npcDialogues["Donna"]) {
      //   console.log("⏳ Waiting before restarting Donna's movement...");
      //   setTimeout(() => {
      //     console.log("🔄 Restarting Donna's movement...");
      //     window.gameState.donnaCooldown = false; // Remove cooldown
      //     moveDonna();
      //     window.gameState.donnaFollowing = true;
      //   }, 200); // 🕒 2-second delay before restarting movement
      // }

       // ✅ If Donna’s dialogue just ended, she should start following Perry
       if (currentDialogue === npcDialogues["Donna"]) {
        console.log("✨ Donna is now following Perry!");
        window.gameState.donnaFollowing = true; // 🔄 Start following after dialogue
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
  isDialogueActive = true;
  window.gameState.freezePerry = true; // ⛔ Freeze movement

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

  boundaries = [];

  // ✅ Apply worldOffsetX/Y dynamically instead of offset.x/y
  collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol === 3807) {
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width + worldOffsetX,
              y: i * Boundary.height + worldOffsetY
            }
          })
        );
      }
    });
  });

  // ✅ Add NPC boundaries dynamically (NO offset needed)
  npcs.forEach(npc => {
    boundaries.push(new Boundary({
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
    boundaries.push(new Boundary({
      position: {
        x: donna.position.x,
        y: donna.position.y,
      },
      width: 64,
      height: 64
    }));
  }

  // ✅ Update movables to recognize new boundaries
  movables = [background, ...boundaries, foreground, extraForegroundObjects, ...npcs, donna];

  // console.log("✅ Boundaries updated. Total count:", boundaries.length);
}

function moveDonna() {
  if (!donna.visible || window.gameState.donnaCooldown) return; // 🛑 Stop if cooldown is active

  console.log("🚀 Moving Donna...");

  const moveAmount = TILE_SIZE / window.MOVEMENT_STEPS;
  let stepProgress = 0;
  const maxSteps = TILE_SIZE * 3;

  const interval = setInterval(() => {
    if (stepProgress >= maxSteps) {
      donna.direction *= -1;
      stepProgress = 0;
    }

    let nextY = donna.position.y - moveAmount * donna.direction;

    // 🛑 **Check if Perry is near Donna, but only if cooldown is inactive**
    if (!window.gameState.donnaCooldown) {
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
        window.gameState.donnaCooldown = true;

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
      if (donna.frameCounter % 1 === 0) {
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
//   if (!window.gameState.donnaFollowing || perryPreviousPositions.length < 3) return;

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
//   if (window.gameState.bikeMode) {
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

function updateDonnaPositionBasedOnKey(key) {
  if (!window.gameState.donnaFollowing) return;

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
  let willCollide = boundaries.some(boundary => {
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

  if (donna.frameCounter % 4 === 0) { // Adjust 10 for animation speed
    donna.frameIndex = (donna.frameIndex + 1) % donna.maxFrames;
  }

  // 🏎 **Check if Perry is in Bike Mode**
  if (window.gameState.bikeMode) {
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


// ✅ Hook into Perry’s movement function
window.addEventListener("keydown", (e) => {
  if (!["w", "a", "s", "d"].includes(e.key)) return;
  updateDonnaPositionBasedOnKey(e.key);
});















