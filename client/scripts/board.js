class Board {
  constructor(width, height) {
    this.chunk = 32;
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;

    this.population = new Population(200, this);
  }

  update() {
    this.population.update();
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
    this.population.draw(ctx);
  }
}