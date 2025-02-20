import { c, canvas } from "./constants.js";
import { map } from "./map.js";

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

export { gameMenu, drawGameMenu, handleMenuSelection, updateGameMenu }