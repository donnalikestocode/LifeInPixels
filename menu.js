import { c, canvas, gameState } from "./constants.js";
import { map } from "./map.js";
import { refreshBoundaries } from "./boundaries.js";

const gameMenu = {
  isOpen: false,
  selectedOption: 0, // 0 = "Show World Map", 1 = "Restart Game"
  options: ["Show World Map", "Restart Game"]
};

function drawGameMenu() {
  const menuBox = document.getElementById("gameMenu");

  if (gameMenu.isOpen) {
    menuBox.classList.remove("hidden");
    menuBox.style.visibility = "visible";
    menuBox.style.opacity = "1";
  } else {
    menuBox.classList.add("hidden");
    menuBox.style.visibility = "hidden";
    menuBox.style.opacity = "0";
    return;
  }

  gameMenu.options.forEach((_, index) => {
    const optionElement = document.getElementById(`menuOption${index}`);
    if (index === gameMenu.selectedOption) {
      optionElement.classList.add("selected");
    } else {
      optionElement.classList.remove("selected");
    }
  });
}

function handleMenuSelection() {
  if (gameMenu.options[gameMenu.selectedOption] === "Show World Map") {
    showWorldMap();
  } else if (gameMenu.options[gameMenu.selectedOption] === "Restart Game") {
    restartGame();
  }

  gameMenu.isOpen = false;
  updateGameMenu();
}

function showWorldMap() {
  map.visible = !map.visible;
}

function restartGame() {
  location.reload();
}

function updateGameMenu() {
  const menuBox = document.getElementById("gameMenu");

  if (gameMenu.isOpen) {
    menuBox.classList.remove("hidden");
    menuBox.style.visibility = "visible";
    menuBox.style.opacity = "1";
  } else {
    menuBox.classList.add("hidden");
    menuBox.style.visibility = "hidden";
    menuBox.style.opacity = "0";
  }
}

const choiceMenu = {
  isOpen: false,
  selectedOption: 0, // 0 = "YES", 1 = "HELL YES"
  options: ["YES", "HELL YES"]
};

function showChoiceMenu() {

  choiceMenu.isOpen = true;
  updateChoiceMenu(); // Show menu visually
}

function updateChoiceMenu() {
  console.log('does it ever get there')
  const choiceBox = document.getElementById("choiceBox");
  choiceBox.classList.remove("hidden");
  choiceBox.style.visibility = "visible";
  choiceBox.style.opacity = "1";
  choiceBox.style.display = "flex";

  // ✅ Update selected option styling
  choiceMenu.options.forEach((option, index) => {
    const optionElement = document.getElementById(`choiceOption${index}`);
    optionElement.innerText = option;
    optionElement.classList.toggle("selected", index === choiceMenu.selectedOption);
  });
}

function handleChoiceSelection() {
  console.log("✅ Player selected:", choiceMenu.options[choiceMenu.selectedOption]);

  // ✅ Close choice menu & continue game
  choiceMenu.isOpen = false;
  closeChoiceMenu();

  console.log("✨ Donna is now following Perry!");
  gameState.donnaFollowing = true; // 🔄 Start following after dialogue
  gameState.freezePerry = false; // Unfreeze Perry
  refreshBoundaries();
}

function closeChoiceMenu() {
  document.getElementById("choiceBox").classList.add("hidden");
  document.getElementById("choiceBox").style.display = "none";
}

export { gameMenu, drawGameMenu, handleMenuSelection, updateGameMenu , choiceMenu, updateChoiceMenu, handleChoiceSelection, showChoiceMenu}