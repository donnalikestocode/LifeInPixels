const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const TILE_SIZE = 64;

window.gameState = {
  bikeMode: false,
  talkedToNPCs: {},
  freezePerry: false,
  donnaBoundaryAdded: false,
  boundariesNeedUpdate: false,
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
  }
})

const donna = new Sprite({
  position: { x: 2880, y: 704},
  image: donnaDownImage,
  name: "Donna",
  frames: { max: 4 },
  sprites: {
    up: donnaUpImage,
    down: donnaDownImage,
    left: donnaLeftImage,
    right: donnaRightImage,
    bikeUp: donnaBikeUpImage,
    bikeDown: donnaBikeDownImage,
    bikeLeft: donnaBikeLeftImage,
    bikeRight: donnaBikeRightImage,
  },
  visible: false,
});

// const npcs = [
//   new Sprite({
//     position: { x: 2700, y: 20 },
//     image: kevinImage,
//     name: "Kevin"
//   }),
//   new Sprite({
//     position: { x: 950, y: 490 },
//     image: lucasImage,
//     name: "Lucas"
//   }),
//   new Sprite({
//     position: { x: 500, y: 900 },
//     image: gioImage,
//     name: "Gio"
//   }),
//   new Sprite({
//     position: { x: 1260, y: 800 },
//     image: connieImage,
//     name: "Connie"
//   }),
//   new Sprite({
//     position: { x: 2555, y: 725 },
//     image: davidImage,
//     name: "David"
//   }),
//   new Sprite({
//     position: { x: 1575, y: 1350 },
//     image: meganImage,
//     name: "Megan"
//   }),
//   new Sprite({
//     position: { x: 1400, y: 100 },
//     image: quynhImage,
//     name: "Quynh"
//   }),
// ];

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

// boundaries.push(
//   new Boundary({
//     position: {
//       x: 2880,
//       y: 704
//     },
//     width: 64,
//     height: 64
//   })
// );

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
let animationCount = 0;
let animationStarted = false;  // ✅ Prevent multiple animate() calls

function animate() {
  if (!animationStarted) {
    animationStarted = true; // ✅ Set flag to prevent multiple calls
  } else {
    return; // ⛔ Stop extra calls
  }

  function loop() {
    // console.log(`📌 Current offset: x=${offset.x}, y=${offset.y}`);

    animationCount++;

    window.requestAnimationFrame(loop);

    // ✅ Refresh boundaries *only if needed*
    if (window.gameState.boundariesNeedUpdate) {
      refreshBoundaries();
      window.gameState.boundariesNeedUpdate = false;  // Reset the flag
    }

    background.draw();
    grid.draw();
    if (donna.visible) {
      donna.draw();
      // boundaries.forEach((boundary) => boundary.draw());
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

let lastMoveTime = 0;
let lastDirectionSwitchTime = performance.now();

function movePlayer(direction) {
  if (isDialogueActive || isMoving|| window.gameState.freezePerry) return;

  // 🔄 Update movement speed based on bike mode dynamically
  window.MOVEMENT_STEPS = window.gameState.bikeMode ? 8 : 16;

  const now = performance.now();

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

  //   const donnaBoundary = new Boundary({
  //     position: { x: 2880, y: 704 },
  //     width: 64,
  //     height: 64
  //   });
  //   boundaries.push(donnaBoundary); // Force reference update
  //   movables = [background, ...boundaries, foreground, extraForegroundObjects, ...npcs, donna];
  // }
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
    console.log("🚧 Collision detected! Stopping movement.");
    isMoving = false;
    player.moving = false;
    return;
  }

  // **Reduce movement steps to make direction switching feel instant**
  let adjustedSteps = window.MOVEMENT_STEPS;
  let stepSizeX = moveX / adjustedSteps;
  let stepSizeY = moveY / adjustedSteps;

  let movementStartTime = performance.now(); // Track start time

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

      if (queuedDirection) {
        movePlayer(queuedDirection);
        queuedDirection = null;
      }
    }
  }

  requestAnimationFrame(stepMove);
}

function startDonnaDialogue() {
  const finalDialogue = [
    "Hi Sir!!! I finally found you!!",
    "I just want to thank you for being my best friend. :3",
    "How’d I get so lucky? I didn’t catch them all, but I caught the only one that matters to me.",
    "Wherever life takes us, I’m happy to walk (or bike) this journey alongside you.",
    "Will you be my valentine and continue to explore together side by side? ♥️"
  ];

  let dialogueIndex = 0;
  const dialogueBox = document.getElementById("dialogueBox");
  dialogueBox.classList.remove("hidden");
  dialogueBox.style.display = "flex";
  document.getElementById("dialogueText").innerText = finalDialogue[dialogueIndex];

  function nextDialogue(event) {
    if (event.key === "Enter") {
      dialogueIndex++;
      if (dialogueIndex < finalDialogue.length) {
        document.getElementById("dialogueText").innerText = finalDialogue[dialogueIndex];
      } else {
        // 🎉 End dialogue & remove event listener
        document.getElementById("dialogueBox").classList.add("hidden");
        document.removeEventListener("keydown", nextDialogue);

        // ✅ Unfreeze Perry so he can move again
        window.gameState.freezePerry = false;
        console.log("✅ Perry can move again!");
      }
    }
  }

  document.addEventListener("keydown", nextDialogue);
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (activeNpc && !isDialogueActive) {

      if (window.gameState.bikeMode) {
        window.gameState.bikeMode = false;
        updateMovementSpeed();
        updatePlayerSprite();  // 🔄 Instantly switch back to walking sprite
      }

      handleNpcInteraction(activeNpc);

      const dialogueBox = document.getElementById("dialogueBox");

      dialogueBox.classList.remove("hidden");
      dialogueBox.style.visibility = "visible";
      dialogueBox.style.opacity = "1";
      dialogueBox.style.display = "flex";

      const npcName = activeNpc.name;

      if (!npcDialogues[npcName]) return;

      dialogueIndex = 0;
      isDialogueActive = true;

      document.getElementById("dialogueText").innerText =
        npcDialogues[npcName][dialogueIndex];

    } else if (isDialogueActive) {
      dialogueIndex++;

      const npcName = activeNpc.name;
      if (dialogueIndex < npcDialogues[npcName].length) {
        document.getElementById("dialogueText").innerText =
          npcDialogues[npcName][dialogueIndex];
      } else {
        document.getElementById("dialogueBox").classList.add("hidden");
        document.getElementById("dialogueBox").style.visibility = "hidden";
        document.getElementById("dialogueBox").style.display = "none";

        isDialogueActive = false;
        dialogueIndex = 0;
        activeNpc = null;
      }
    }
    return; // ⛔ Prevent movement when pressing "Enter"
  }

  if (isDialogueActive) return; // ⛔ Block movement during dialogue

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
      }
    }
  }
}


// function addDonnaToBoundaries() {
//   console.log("🛑 Adding Donna's boundary at (2880, 704)");

//   const donnaBoundary = new Boundary({
//     position: { x: 2880, y: 704 },
//     width: 64,
//     height: 64
//   });

//   boundaries.push(donnaBoundary);

//   console.log("✅ Boundaries updated:", boundaries.length);
//   console.log("📌 Boundaries array:", boundaries);

//   requestAnimationFrame(animate);
// }

function refreshBoundaries() {
  console.log("🔄 Refreshing boundaries...");
  console.log(`📌 Current world offset: x=${worldOffsetX}, y=${worldOffsetY}`);

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

  console.log("✅ Boundaries updated. Total count:", boundaries.length);
}







