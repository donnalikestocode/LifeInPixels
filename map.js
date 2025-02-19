import { offset } from "./constants.js";
import { Sprite } from "./classes.js";
import { image, foregroundImage, extraForegroundObjectsImage } from "./assets.js";

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

export { background, foreground, extraForegroundObjects }