const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

window.MOVEMENT_STEPS = 16;

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, i + 70))
}

const boundaries = []

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
    right: playerRightImage
  }
})

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
  new Sprite({
    position: { x: 2688, y: 0 },
    image: kevinImage,
    name: "Kevin"
  }),
  new Sprite({
    position: { x: 960, y: 512 },
    image: lucasImage,
    name: "Lucas"
  }),
  new Sprite({
    position: { x: 512, y: 896 },
    image: gioImage,
    name: "Gio"
  }),
  new Sprite({
    position: { x: 1280, y: 768 },
    image: connieImage,
    name: "Connie"
  }),
  new Sprite({
    position: {x: 2560, y: 704 },
    image: davidImage,
    name: "David"
  }),
  new Sprite({
    position: { x: 1600, y: 1344 },
    image: meganImage,
    name: "Megan"
  }),
  new Sprite({
    position: { x: 1408, y: 128 },
    image: quynhImage,
    name: "Quynh"
  }),
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

// const npcBoundaries = [];

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

const movables = [background, ...boundaries, foreground, extraForegroundObjects, ...npcs]

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

function animate() {
  window.requestAnimationFrame(animate);
  background.draw();
  // grid.draw();
  boundaries.forEach((boundary) => boundary.draw());

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
      console.log(`✅ NPC detected: ${npc.name}`);
      npcNearby = npc;
    }
  });

  activeNpc = npcNearby; // Update the active NPC

  player.draw();
  foreground.draw();
  extraForegroundObjects.draw();

  if (isDialogueActive) return;
}

animate()

let isMoving = false;
let queuedDirection = null;
let stepProgress = 0;
let currentFrame = null;
const TILE_SIZE = 64;

let lastMoveTime = 0;
let lastDirectionSwitchTime = performance.now();


function movePlayer(direction) {
  if (isDialogueActive || isMoving) return;

  const now = performance.now();
  // console.log(`🎯 Key Pressed: ${direction}, LastKey: ${lastKey}, IsMoving: ${isMoving}`);

  // Measure switch time
  if (direction !== lastKey) {
    const switchTime = Math.round(now - lastDirectionSwitchTime);
    console.log(`⏳ Time taken to switch direction from ${lastKey} to ${direction}: ${switchTime}ms`);
    lastDirectionSwitchTime = now;
  }

  // 🚨 **FORCE INSTANT SWITCHING**
  if (isMoving && direction !== lastKey) {
    console.log(`⏩ Instant Switch: Stopping ${lastKey}, Switching to ${direction}`);
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
    case "w": player.image = player.sprites.up; moveY = -TILE_SIZE; break;
    case "a": player.image = player.sprites.left; moveX = -TILE_SIZE; break;
    case "s": player.image = player.sprites.down; moveY = TILE_SIZE; break;
    case "d": player.image = player.sprites.right; moveX = TILE_SIZE; break;
  }

  // Check for collision
  let willCollide = boundaries.some(boundary =>
    rectangularCollision({
      rectangle1: { position: { x: player.position.x + moveX, y: player.position.y + moveY }, width: player.width, height: player.height },
      rectangle2: boundary
    })
  );

  if (willCollide) {
    console.log("🚧 Collision detected, stopping movement");
    isMoving = false;
    player.moving = false;
    return;
  }

  // **Reduce movement steps to make direction switching feel instant**
  let adjustedSteps = MOVEMENT_STEPS;
  let stepSizeX = moveX / adjustedSteps;
  let stepSizeY = moveY / adjustedSteps;


  function stepMove() {
    if (stepProgress < adjustedSteps) {
      movables.forEach(movable => {
        movable.position.x -= stepSizeX;
        movable.position.y -= stepSizeY;
      });

      stepProgress++;
      currentFrame = requestAnimationFrame(stepMove);
    } else {
      // console.log(`✅ Move complete.`);

      isMoving = false;
      player.moving = false;

      if (queuedDirection) {
        // console.log(`🔄 Queued movement detected: ${queuedDirection}`);
        movePlayer(queuedDirection);
        queuedDirection = null;
      }
    }
  }

  requestAnimationFrame(stepMove);
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (activeNpc && !isDialogueActive) {
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

  // Movement Handling
  if (isMoving) {
    if (!queuedDirection) queuedDirection = e.key;  // ✅ **Queue only if empty**
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