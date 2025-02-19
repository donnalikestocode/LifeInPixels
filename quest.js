import { gameState } from "./constants.js";
import { npcs } from "./npcs.js";
import { startDialogue } from "./dialogues.js";
import { donna } from "./companion.js";
import { moveDonna } from "./companion.js";
import { refreshBoundaries } from "./boundaries.js";

function handleNpcInteraction(npc) {
  if (!gameState.talkedToNPCs[npc.name]) {
    gameState.talkedToNPCs[npc.name] = true;
    console.log(`✅ Perry talked to ${npc.name}`);

    if (Object.values(gameState.talkedToNPCs).every(Boolean)) {
      console.log("🎉 All NPCs talked to! Donna will now appear...");
      donna.visible = true;

      refreshBoundaries();

      // if (!gameState.donnaBoundaryAdded) {
      //   gameState.donnaBoundaryAdded = true;
      //   refreshBoundaries();
      // }
      moveDonna();

      // ⏳ Wait 7 seconds, then trigger Perry's realization
      setTimeout(() => {
        startDialogue("PerryHint");
      }, 7000);
    }

  }
}

export { handleNpcInteraction };