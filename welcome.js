import { Sprite } from "./classes.js";
import { c, gameState } from "./constants.js";
import { heartThoughtBubble } from "./emotions.js";
import { thoughtBubble } from "./quest.js";
import { donna } from "./companion.js";


function startIntroDialogue() {
  const dialogueBox = document.getElementById("dialogueBox");

  dialogueBox.classList.remove("hidden");
  dialogueBox.style.visibility = "visible";
  dialogueBox.style.opacity = "1";
  dialogueBox.style.display = "flex";

  document.getElementById("dialogueText").innerText = introDialogue[gameState.introDialogueIndex];;

    // Change the sprite based on which part of the dialogue we're on
    if (gameState.introDialogueIndex < 2) {
      thoughtBubble.visible = true;
      heartThoughtBubble.visible = false;
    } else {
      thoughtBubble.visible = false;
      heartThoughtBubble.visible = true;
    }
}

export { startIntroDialogue };