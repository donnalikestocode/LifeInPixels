
import {canvas, c} from "./constants.js";
import {offset} from "./constants.js";
import {gameState} from "./constants.js";

class Sprite {
  constructor({ position, velocity, image, frames = {max: 1}, sprites, name, visible = true}) {
    this.position = position;
    this.image = image
    this.visible = visible;
    this.frames = {... frames, val: 0, elapsed: 0}
    this.name = name

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    }

    this.moving = false
    this.sprites = sprites
  }

  draw() {
    if (!this.visible) return;

    c.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width/ this.frames.max ,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width/this.frames.max,
      this.image.height
    );

    if(!this.moving) return

    if (this.frames.max > 1) {
      this.frames.elapsed++
    }

  }
}

class Boundary {
  static width = 64;
  static height = 64;
  constructor({position}) {
    this.position = position;
    this.width = 64;
    this.height = 64;
  }

  draw() {
    c.fillStyle = "rgba(255, 0, 0, 0.5)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

export {Sprite, Boundary};