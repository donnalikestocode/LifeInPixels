class Sprite {
  constructor({ position, velocity, image, frames = {max: 1}, sprites, name}) {
    this.position = position;
    this.image = image
    this.frames = {... frames, val: 0, elapsed: 0}
    this.name = name

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
      console.log(this.width, this.height)
    }

    this.moving = false
    this.sprites = sprites
  }

  draw() {
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

    if (this.frames.elapsed % 30 === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++
      else this.frames.val = 0
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

const offset = {
  x: Math.round(-600 / 64) * 64, // Round to nearest grid position
  y: Math.round(-1070 / 64) * 64
};

class Grid {
  constructor() {
    this.gridSize = 64;
  }

  draw() {
    // Main grid
    c.strokeStyle = 'rgba(0, 255, 0, 0.5)'; // Light green, mostly transparent
    c.lineWidth = 1;

    // Draw vertical lines
    for (let x = offset.x % this.gridSize; x < canvas.width; x += this.gridSize) {
      c.beginPath();
      c.moveTo(x, 0);
      c.lineTo(x, canvas.height);
      c.stroke();
    }

    // Draw horizontal lines
    for (let y = offset.y % this.gridSize; y < canvas.height; y += this.gridSize) {
      c.beginPath();
      c.moveTo(0, y);
      c.lineTo(canvas.width, y);
      c.stroke();
    }

    // Draw NPC interaction zones - Modified to align with map grid
    npcs.forEach(npc => {
      c.strokeStyle = 'rgba(255, 255, 0, 0.5)';
      c.lineWidth = 2;

      // Align NPC grid area to the map grid
      const npcGridX = Math.floor(npc.position.x / this.gridSize) * this.gridSize;
      const npcGridY = Math.floor(npc.position.y / this.gridSize) * this.gridSize;

      const gridArea = {
        x: npcGridX - this.gridSize,
        y: npcGridY - this.gridSize,
        width: this.gridSize * 3,
        height: this.gridSize * 3
      };

      c.strokeRect(
        gridArea.x,
        gridArea.y,
        gridArea.width,
        gridArea.height
      );

      // NPC center point - also aligned to grid
      c.fillStyle = 'rgba(255, 0, 0, 0.5)';
      c.beginPath();
      c.arc(npcGridX + this.gridSize/2, npcGridY + this.gridSize/2, 3, 0, Math.PI * 2);
      c.fill();
    });

    // Draw Player grid highlight
    c.strokeStyle = 'rgba(0, 100, 255, 0.5)'; // Blue for player
    c.lineWidth = 2;

    // Draw player's current grid cell
    const playerGridArea = {
      x: Math.floor(player.position.x / this.gridSize) * this.gridSize,
      y: Math.floor(player.position.y / this.gridSize) * this.gridSize,
      width: this.gridSize,
      height: this.gridSize
    };

    c.strokeRect(
      playerGridArea.x,
      playerGridArea.y,
      playerGridArea.width,
      playerGridArea.height
    );

    // Player center point
    c.fillStyle = 'rgba(0, 100, 255, 0.5)';
    c.beginPath();
    c.arc(player.position.x, player.position.y, 3, 0, Math.PI * 2);
    c.fill();
  }
}

// Create a grid instance
const grid = new Grid();