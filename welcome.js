import { Sprite } from "./classes.js";
import { c, gameState } from "./constants.js";
import { heartThoughtBubbleImage } from "./assets.js";


function startIntroDialogue() {
  const dialogueBox = document.getElementById("dialogueBox");

  dialogueBox.classList.remove("hidden");
  dialogueBox.style.visibility = "visible";
  dialogueBox.style.opacity = "1";
  dialogueBox.style.display = "flex";

  document.getElementById("dialogueText").innerText = introDialogue[gameState.introDialogueIndex];
}

export { startIntroDialogue };