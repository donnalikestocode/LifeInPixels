import { gameState,c } from "./constants.js";
import { npcs } from "./npcs.js";
import { startDialogue } from "./dialogues.js";
import { donna } from "./companion.js";
import { moveDonna } from "./companion.js";
import { refreshBoundaries } from "./boundaries.js";
import { Sprite } from "./classes.js";
import { thoughtBubbleImage } from "./assets.js";
import { player } from "./player.js";

// Create thought bubble sprite
const thoughtBubble = {
  position: {
    x: player.position.x,
    y: player.position.y -64,
  },
  currentSprite: thoughtBubbleImage,
  visible: false,
  width: 64,
  height: 64,
};

function drawThoughtBubble() {
  if (!thoughtBubble.visible) return;

  // console.log('drawing thought bubble')

  // thoughtBubble.position.x = player.position.x - 16;
  // thoughtBubble.position.y = player.position.y - 48;

  c.drawImage(
    thoughtBubble.currentSprite,
    0, // Offset to get the correct frame
    0,
    thoughtBubble.width,
    thoughtBubble.height,
    thoughtBubble.position.x,
    thoughtBubble.position.y,
    thoughtBubble.width,
    thoughtBubble.height,
  );
}

function handleNpcInteraction(npc) {
  if (!gameState.talkedToNPCs[npc.name]) {
    gameState.talkedToNPCs[npc.name] = true;
    console.log(`✅ Perry talked to ${npc.name}`);

    if (Object.values(gameState.talkedToNPCs).every(Boolean)) {
      console.log("🎉 All NPCs talked to! Donna will now appear...");
      donna.visible = true;
      refreshBoundaries();
      moveDonna();

      // ✅ Thought bubble and dialogue appear at the same time
      setTimeout(() => {
        startDialogue("PerryHint");
        // console.log("💭 Thought bubble appears with dialogue.");
      }, 3500); // Delay before Perry's hint

    }
  }
}


export { thoughtBubble, drawThoughtBubble, handleNpcInteraction}