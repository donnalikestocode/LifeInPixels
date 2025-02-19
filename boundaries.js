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
  gameState.boundaries = [];

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

  if (donna.visible && !gameState.donnaFollowing) {
    console.log("Adding Donna boundary");
    gameState.boundaries.push(new Boundary({
      position: {
        x: donna.position.x,
        y: donna.position.y,
      },
      width: 64,
      height: 64
    }));
  }

  gameState.movables = [background, ...gameState.boundaries, foreground, extraForegroundObjects, ...npcs, donna];

}

export { refreshBoundaries };