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
      moveDonna();

      setTimeout(() => {
        startDialogue("PerryHint");
      }, 3500);
    }

  }
}

export { handleNpcInteraction };