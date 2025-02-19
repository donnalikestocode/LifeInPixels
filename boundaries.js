import {offset, gameState } from "./constants.js";
import {Boundary } from "./classes.js";
import { donna } from "./companion.js";
import { npcs } from "./npcs.js";
import { background, foreground, extraForegroundObjects } from "./map.js";

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

export { refreshBoundaries };