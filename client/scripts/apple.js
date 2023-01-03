class Apple {
  constructor(boardWidth, boardHeight, appleWidth, appleHeight) {
    this.width = appleWidth;
    this.height = appleHeight;
    this.x = chunkify(Math.floor(Math.random() * (boardWidth - this.width)), 32);
    this.y = chunkify(Math.floor(Math.random() * (boardHeight - this.height)), 32);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = 'red';
    ctx.fill();
  }

  respawn(boardWidth, boardHeight) {
    this.x = chunkify(Math.floor(Math.random() * (boardWidth - this.width)), 32);
    this.y = chunkify(Math.floor(Math.random() * (boardHeight - this.height)), 32);
  }
}