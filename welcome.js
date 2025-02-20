import { Sprite } from "./classes.js";
import { c, gameState, canvas } from "./constants.js";
import { keyboardKeysImage } from "./assets.js";

const keyboardKeys = {
  position: {
    x: 0,
    y: 0,
  },
  currentSprite: keyboardKeysImage,
  visible: false,
  width: canvas.width,
  height: canvas.height,
}

function drawKeyboardKeys() {
  if (!keyboardKeys.visible) return;

  console.log("🖼 Drawing keyboard keys at:", keyboardKeys.position);

  c.drawImage(
    keyboardKeys.currentSprite, // The image
    0, 0, // Source X, Y (entire image)
    keyboardKeys.currentSprite.width, keyboardKeys.currentSprite.height, // Source Width, Height
    keyboardKeys.position.x, keyboardKeys.position.y, // Destination X, Y (where to draw on canvas)
    keyboardKeys.width, keyboardKeys.height // Scale to fit
  );
}

function startIntroDialogue() {
  const dialogueBox = document.getElementById("dialogueBox");

  dialogueBox.classList.remove("hidden");
  dialogueBox.style.visibility = "visible";
  dialogueBox.style.opacity = "1";
  dialogueBox.style.display = "flex";

  document.getElementById("dialogueText").innerText = introDialogue[gameState.introDialogueIndex];;

    // Change the sprite based on which part of the dialogue we're on
    if (gameState.introDialogueIndex < 2) {

      keyboardKeys.visible = false;
    } else {
      keyboardKeys.visible = true;
    }
}

export { startIntroDialogue, keyboardKeys, drawKeyboardKeys };