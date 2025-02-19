import { gameState } from "./constants.js";
import { donna } from "./companion.js";
import { donnaUpImage, donnaDownImage, donnaLeftImage, donnaRightImage } from "./assets.js";
import { player } from "./player.js";
import { refreshBoundaries } from "./boundaries.js";

let dialogueIndex = 0;
let currentDialogue = null;

function startDialogue(npcName) {
  if (!npcDialogues[npcName]) return;

  if (npcName === "Donna") {
    faceEachOtherBeforeDialogue(); // Donna turns to face Perry
  }

  dialogueIndex = 0;
  gameState.isDialogueActive = true;
  gameState.freezePerry = true; // ⛔ Freeze movement

  currentDialogue = npcDialogues[npcName]; // ✅ Track active dialogue

  // ✅ Ensure the dialogue box is fully visible
  const dialogueBox = document.getElementById("dialogueBox");
  dialogueBox.classList.remove("hidden");
  dialogueBox.style.visibility = "visible";
  dialogueBox.style.opacity = "1";
  dialogueBox.style.display = "flex";

  document.getElementById("dialogueText").innerText = currentDialogue[dialogueIndex];
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

      gameState.isDialogueActive = false;
      gameState.freezePerry = false; // ✅ Unfreeze Perry

       if (currentDialogue === npcDialogues["Donna"]) {
        console.log("✨ Donna is now following Perry!");
        gameState.donnaFollowing = true; // 🔄 Start following after dialogue
        refreshBoundaries();
      }

      dialogueIndex = 0;
      currentDialogue = null;
    }
  }
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

export {startDialogue, advanceDialogue };