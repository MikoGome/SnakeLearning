class Board {
  constructor(width, height) {
    this.chunk = 32;
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.snake = new Snake(
      chunkify(this.width / 2, 32),
      chunkify(this.height / 2, 32)
      );
    this.apple = new Apple(this.width, this.height, this.chunk, this.chunk);

    this.snake.see(this.apple, this)
  }

  update() {
    this.snake.update();
    this.collision();
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
    this.snake.draw(ctx);
    this.apple.draw(ctx);
  }

  collision() {
    //check if snake ate apple
    if(
      this.snake.head.x < this.apple.x + this.apple.width &&
      this.snake.head.x + this.snake.head.width > this.apple.x &&
      this.snake.head.y < this.apple.y + this.apple.height &&
      this.snake.head.y + this.snake.head.height > this.apple.y
    ) {
      this.snake.expand(this.snake.head.x, this.snake.head.y, this.snake.head.width, this.snake.head.height);
      this.apple.respawn(this.width, this.height);
    } else if( //check if snake is out of boundary
      this.snake.head.x < 0 ||
      this.snake.head.x + this.snake.head.width > this.width ||
      this.snake.head.y < 0 ||
      this.snake.head.y + this.snake.head.height > this.height
    ) {
      this.snake.isDead = true;
    }
  }
}