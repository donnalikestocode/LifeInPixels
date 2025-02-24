import { offset, canvas, gameState, c } from "./constants.js";
import { Sprite } from "./classes.js";
import { image, foregroundImage, extraForegroundObjectsImage } from "./assets.js";

const map = {
  position: {
    x: canvas.width * 0.1,
    y: canvas.height * 0.1
  },
  image: image,
  visible: false,
  width: canvas.width * 0.8,
  height: canvas.height * 0.8,
};

function drawWorldMap() {
  if (!map.visible) return;
  c.fillStyle = "white";
  c.fillRect(
    map.position.x - 5,
    map.position.y - 5,
    map.width + 10,
    map.height + 10
  );
  c.drawImage(
    map.image,
    0, 0,
    map.image.width, map.image.height,
    map.position.x, map.position.y,
    map.width, map.height
  );
}

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
});

const extraForegroundObjects = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: extraForegroundObjectsImage,
});

export { background, foreground, extraForegroundObjects, map, drawWorldMap }