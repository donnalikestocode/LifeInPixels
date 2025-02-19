export const canvas = document.querySelector("canvas");
canvas.width = 1024;
canvas.height = 576;
export const c = canvas.getContext("2d");
c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);


export const keys = {
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

export const TILE_SIZE = 64;
export const offset = {
  x: Math.floor(-600 / 64) * 64,
  y: Math.floor(-1070 / 64) * 64
};

export const gameState = {
  worldOffsetX: offset.x,
  worldOffsetY: offset.y,

  movables: [],

  boundaries: [],

  isMoving: false,
  lastKey: "",
  queuedDirection: null,
  stepProgress: 0,
  freezePerry: false,

  isDialogueActive: false,

  bikeMode: false,

  talkedToNPCs: {},

  donnaCooldown: false,
  donnaFollowing: false,
  MOVEMENT_STEPS: 32, //this is always the walking speed initally
};