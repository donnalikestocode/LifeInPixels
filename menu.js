import { c, canvas } from "./constants.js";

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

  // ✅ Update selected menu item styling
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
  console.log("✅ Selected:", gameMenu.options[gameMenu.selectedOption]);

  if (gameMenu.options[gameMenu.selectedOption] === "Show World Map") {
    showWorldMap();
  } else if (gameMenu.options[gameMenu.selectedOption] === "Restart Game") {
    restartGame();
  }

  gameMenu.isOpen = false; // ✅ Close the menu after selection
  updateGameMenu(); // ✅ Ensure the UI updates
}

function showWorldMap() {
  console.log("🗺 Showing the world map!");
  // Implement map display logic here
}

function restartGame() {
  console.log("🔄 Restarting game...");
  location.reload(); // Refreshes the page to restart the game
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