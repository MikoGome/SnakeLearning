class Snake {
  constructor(x, y) {
    this.head = new Part(x, y, 32, 32, 'right');
    this.body = []; 
    this.controls = new Controls();
    this.speed = 4;
    this.isDead = false;

    this.appleSensors = null;
    this.wallSensors = null;
  }

  see(apple, board) {
    this.appleSensors = new Sensor(8, this.head, apple);
    this.wallSensors = new Sensor(8, this.head, board);
  }

  update() {
    if(this.isDead) {
      return;
    }
    this.body.unshift(new Part(this.head.x, this.head.y, this.head.width, this.head.height));
    this.body.pop();
    this.move();
    this.checkCollision();
    if(this.#canTurn()) {
      this.turn();
    }
    this.appleSensors.update();
    this.wallSensors.update();
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.rect(this.head.x, this.head.y, 32, 32);
    ctx.fillStyle = 'lightgreen';
    ctx.fill();
    this.body.forEach((part) => {
      ctx.beginPath();
      ctx.rect(part.x, part.y, part.width, part.height);
      ctx.fillStyle= 'green';
      ctx.fill();
    });
    this.appleSensors.draw(ctx, 'yellow');
  }

  move() {
    switch(this.head.direction) {
      case 'up':
        this.head.y -= this.speed;
        break;
      case 'down':
        this.head.y += this.speed;
        break;
      case 'left':
        this.head.x -= this.speed;
        break;
      case 'right':
        this.head.x += this.speed;
        break;
    }
  }

  turn() {
    if(this.controls.up) {
      if(this.head.direction === 'down') return;
      this.head.direction = 'up';
    } else if(this.controls.down) {
      if(this.head.direction === 'up') return;
      this.head.direction = 'down';
    } else if(this.controls.right) {
      if(this.head.direction === 'left') return;
      this.head.direction = 'right';
    } else if(this.controls.left) {
      if(this.head.direction === 'right') return;
      this.head.direction = 'left';
    }
  }

  #canTurn() {
    if(this.head.x % 32 === 0 && this.head.y % 32 === 0) {
      return true;
    }
    return false;
  }

  expand(x, y, width, height) {
    for(let i = 0; i < 8; i++) {
      this.body.push(new Part(x, y, width, height));
    }
  }

  checkCollision() {
    for(let i = 0; i < this.body.length; i++) {
      const part = this.body[i];
      if(
        this.head.direction === 'left' &&
        this.head.x < part.x + part.width &&
        this.head.x + 1 > part.x &&
        this.head.y < part.y + part.height &&
        this.head.y + this.head.height > part.y
      ) {
        this.isDead = true;
        break;
      } else if(
        this.head.direction === 'right' &&
        this.head.x + this.head.width - 1 < part.x + part.width &&
        this.head.x + this.head.width > part.x &&
        this.head.y < part.y + part.height &&
        this.head.y + this.head.height > part.y
      ) {
        this.isDead = true;
        break;
      } else if(
        this.head.direction === 'up' &&
        this.head.x < part.x + part.width &&
        this.head.x + this.head.width > part.x &&
        this.head.y < part.y + part.height &&
        this.head.y + 1 > part.y
      ){
        this.isDead = true;
        break;
      } else if(
        this.head.direction === 'down' &&
        this.head.x < part.x + part.width &&
        this.head.x + this.head.width > part.x &&
        this.head.y + this.head.height - 1 < part.y + part.height &&
        this.head.y + this.head.height > part.y
      ){
        this.isDead = true;
        break;
      }
    }
  }
}