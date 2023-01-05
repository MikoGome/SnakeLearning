class Snake {
  constructor(x, y) {
    this.head = new Part(x, y, 32, 32, 'right');
    this.body = [];
    this.bodyDirections = [];
    this.controls = new Controls();
    this.speed = 4;
    this.isDead = false;
    this.consuming = false;
    this.consumed = null;

    this.appleSensors = null;
    this.bodySensors = null;
    this.wallSensors = null;
  }

  see(apple, board) {
    this.appleSensors = new Sensor(8, this.head, apple, board);
    this.bodySensors = new Sensor(8, this.head, this.body, board);
    this.wallSensors = new Sensor(8, this.head, board, board);
  }

  update() {
    if(this.isDead) {
      return;
    }
    this.follow();
    if(this.#canTurn()) {
      this.checkCollision();
      this.turn();
      this.move();
      if(this.consuming) {
        this.digest();
      }
      this.consuming = false;
    } else {
      this.move();
    }
    
    this.appleSensors.update();
    this.bodySensors.update();
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
    // this.appleSensors.draw(ctx, 'yellow');
    this.bodySensors.draw(ctx, 'blue');
    // this.wallSensors.draw(ctx, 'red');
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
    for(let i = this.body.length - 1; i >= 0; i--) {
      if(i === 0) {
        this.body[i].direction = this.head.direction;
      } else {
        this.body[i].direction = this.body[i-1].direction;
      }
    }
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

  consume() {
    if(this.body.length) {
      const lastPart = this.body[this.body.length - 1];
      switch(lastPart.direction) {
        case 'up':
          this.consumed = new Part(lastPart.x, lastPart.y, lastPart.width, lastPart.height, lastPart.direction);
          break;
        case 'down':
          this.consumed = new Part(lastPart.x, lastPart.y, lastPart.width, lastPart.height, lastPart.direction);
          break;
        case 'left':
          this.consumed = new Part(lastPart.x, lastPart.y, lastPart.width, lastPart.height, lastPart.direction);
          break;
        case 'right':
          this.consumed = new Part(lastPart.x, lastPart.y, lastPart.width, lastPart.height, lastPart.direction);
          break;
      }
    } else {
      this.consumed = new Part(this.head.x, this.head.y, this.head.width, this.head.height, this.head.direction);
    }
    this.consuming = true;
  }

  digest() {
    if(this.consumed) {
      this.body.push(this.consumed);
      this.consumed = null;
    }
  }

  checkCollision() {
    for(let i = 0; i < this.body.length; i++) {
      const part = this.body[i];
      if(
        this.head.x < part.x + part.width &&
        this.head.x + 1 > part.x &&
        this.head.y < part.y + part.height &&
        this.head.y + this.head.height > part.y
      ) {
        console.log('collided');
      }
    }
  }

  follow() {
    for(let i = this.body.length - 1; i >= 0; i--) {
      switch(this.body[i].direction) {
        case 'up':
          this.body[i].y -= this.speed;
          break;
        case 'down':
          this.body[i].y += this.speed;
          break;
        case 'left':
          this.body[i].x -= this.speed;
          break;
        case 'right':
          this.body[i].x += this.speed;
          break;
      }
    }
    if(this.body.length) {
      switch(this.head.direction) {
        case 'up':
          this.body[0].y = this.head.y + this.head.height;
          break;
        case 'down':
          this.body[0].y = this.head.y - this.head.height;
          break;
        case 'left':
          this.body[0].x = this.head.x + this.head.width;
          break;
        case 'right':
          this.body[0].x = this.head.x - this.head.width;
          break;
      }
    }
  }
}