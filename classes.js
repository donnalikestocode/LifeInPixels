const MOVEMENT_STEPS = window.MOVEMENT_STEPS || 16;
import {canvas, c} from "./constants.js";
import {offset} from "./constants.js";
import {gameState} from "./constants.js";

let bikeMode = gameState.bikeMode;

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

    if (this.frames.elapsed % Math.round(bikeMode ? MOVEMENT_STEPS / 4 : MOVEMENT_STEPS/2) === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++
      else this.frames.val = 0
    }

    if (this.frames.elapsed >= MOVEMENT_STEPS) {
      this.frames.elapsed = 0;
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