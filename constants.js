export const canvas = document.querySelector("canvas");
canvas.width = 1024;
canvas.height = 576;
export const c = canvas.getContext("2d");

export const TILE_SIZE = 64;
export const offset = {
  x: Math.floor(-600 / 64) * 64, // Force align to grid
  y: Math.floor(-1070 / 64) * 64
};

export const gameState = {
  isMoving: false,
  queuedDirection: null,
  stepProgress: 0,
  isDialogueActive: false,
  lastKey: "",
  boundaries: [],
  bikeMode: false,
  talkedToNPCs: {},
  freezePerry: false,
  donnaBoundaryAdded: false,
  boundariesNeedUpdate: false,
  donnaCooldown: false,
  donnaFollowing: false,
  movables: [],
  worldOffsetX: 0,
  worldOffsetY: 0,
};