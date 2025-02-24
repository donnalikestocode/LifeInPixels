import { Sprite } from "./classes.js";
import { c, gameState, canvas } from "./constants.js";
import { keyboardKeysImage,introSpriteImage, happyImage, introBackgroundImage } from "./assets.js";

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

  c.drawImage(
    keyboardKeys.currentSprite, // The image
    0, 0, // Source X, Y (entire image)
    keyboardKeys.currentSprite.width, keyboardKeys.currentSprite.height, // Source Width, Height
    keyboardKeys.position.x, keyboardKeys.position.y, // Destination X, Y (where to draw on canvas)
    keyboardKeys.width, keyboardKeys.height // Scale to fit
  );
}

const introSprite = {
  position: {
    x: 0,
    y: 0,
  },
  currentSprite: introSpriteImage,
  visible: false,
  width: canvas.width,
  height: canvas.height,
}

function drawIntroSprite() {
  if (!introSprite.visible) return;

  c.drawImage(
    introSprite.currentSprite, // The image
    0, 0, // Source X, Y (entire image)
    introSprite.currentSprite.width, introSprite.currentSprite.height, // Source Width, Height
    introSprite.position.x, introSprite.position.y, // Destination X, Y (where to draw on canvas)
    introSprite.width, introSprite.height // Scale to fit
  );
}

const finalIntroSprite = {
  position: {
    x: (canvas.width / 2) - (64 / 2), // Center horizontally
    y: (canvas.height / 2) - (64 / 2), // Center vertically
  },
  currentSprite: happyImage,
  visible: false,
  width: 64, // ✅ Actual sprite size
  height: 128, // ✅ Actual sprite size
};


function drawFinalIntroSprite() {
  if (!finalIntroSprite.visible) return;

  c.drawImage(
    finalIntroSprite.currentSprite, // The image
    0, 0, // Source X, Y (entire image)
    finalIntroSprite.currentSprite.width, finalIntroSprite.currentSprite.height, // Source Width, Height
    finalIntroSprite.position.x, finalIntroSprite.position.y, // Destination X, Y (where to draw on canvas)
    finalIntroSprite.width, finalIntroSprite.height // Scale to fit
  );
}

const introBackground = {
  position: {
    x: 0,
    y: 0,
  },
  currentSprite: introBackgroundImage,
  visible: false,
  width: canvas.width,
  height: canvas.height,
}

function drawIntroBackground() {
  if (!introBackground.visible) return;

  c.drawImage(
    introBackground.currentSprite, // The image
    0, 0, // Source X, Y (entire image)
    introBackground.currentSprite.width, introBackground.currentSprite.height, // Source Width, Height
    introBackground.position.x, introBackground.position.y, // Destination X, Y (where to draw on canvas)
    introBackground.width, introBackground.height // Scale to fit
  );
}

function startIntroDialogue() {
  const dialogueBox = document.getElementById("dialogueBox");

  dialogueBox.classList.remove("hidden");
  dialogueBox.style.visibility = "visible";
  dialogueBox.style.opacity = "1";
  dialogueBox.style.display = "flex";

  document.getElementById("dialogueText").innerText = introDialogue[gameState.introDialogueIndex];;

  // 🎬 First two dialogues (Index 0 & 1) = Welcome screen
  if (gameState.introDialogueIndex < 2) {
    console.log("🎬 First two dialogues (Index 0 & 1) = Welcome screen");
    keyboardKeys.visible = false;
    introSprite.visible = true;
    finalIntroSprite.visible = false;

    console.log("After change - is intro visible?", introSprite.visible);
  }
  // 🕹 Third dialogue (Index 2) = Show keyboard instructions
  else if (gameState.introDialogueIndex === 2) {
    console.log("🕹 Third dialogue (Index 2) = Show keyboard instructions");
    console.log("is intro visible", introSprite.visible);
    introSprite.visible = false;
    keyboardKeys.visible = true;
    finalIntroSprite.visible = false;
    introBackground.visible = true;
  }
  // ✨ Last dialogue (Final index) = Show final image
  else if (gameState.introDialogueIndex === introDialogue.length - 1) {
    console.log("✨ Last dialogue (Final index) = Show final image");
    keyboardKeys.visible = false;
    introSprite.visible = false;
    finalIntroSprite.visible = true;
    introBackground.visible = true;
  }
}

export { startIntroDialogue, keyboardKeys, drawKeyboardKeys, introSprite, drawIntroSprite, finalIntroSprite, drawFinalIntroSprite, drawIntroBackground, introBackground };