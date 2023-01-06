class Snake {
  constructor(width, height, chunk) {

    this.boardWidth = width;
    this.boardHeight = height;

    const x = chunkify(this.boardWidth / 2, 32);
    const y = chunkify(this.boardHeight / 2, 32);

    this.head = new Part(x, y, 32, 32, 'right');
    this.body = [];
    this.bodyDirections = [];
    this.controls = new Controls();
    this.speed = 4;
    this.isDead = false;
    this.consumed = null;

    this.apple = new Apple(this.boardWidth, this.boardHeight, chunk, chunk);

    this.appleSensors = null;
    this.bodySensors = null;
    this.wallSensors = null;

    this.brain = new NeuralNetwork([32, 16, 8, 4]);

    this.fitness = 0;
  }

  see(board) {
    this.appleSensors = new Sensor(8, this.head, this.apple, board);
    this.bodySensors = new Sensor(8, this.head, this.body, board);
    this.wallSensors = new Sensor(8, this.head, board, board);
  }

  stimulateMotor() {
    const appleOffsets = this.appleSensors.rays.map(appleSensor => appleSensor[1].offset);
    const bodyOffsets = this.bodySensors.rays.map(bodySensor => bodySensor[1].offset);
    const wallOffsets = this.wallSensors.rays.map(wallSensor => wallSensor[1].offset);
    const outputs = this.brain.feedForward([...appleOffsets, ...bodyOffsets, ...wallOffsets]);

    for(let i = 0; i < outputs.length; i++) {
      const output = outputs[i];
      switch(i) {
        case 0:
          if(output) {
            this.controls.turnOff();
            this.controls.up = true;
          }
          break;
        case 1:
          if(output) {
            this.controls.turnOff();
            this.controls.down = true;
          }
          break;
        case 2:
          if(output) {
            this.controls.turnOff();
            this.controls.left = true;
          }
          break;
        case 3:
          if(output) {
            this.controls.turnOff();
            this.controls.right = true;
          }
          break;
      }
    }
  }
  
  update() {
    
    if(this.isDead) {
      return;
    }
    this.move();
    this.follow();
    if(this.#canTurn()) {
      this.straighten();
      this.checkCollision();
      this.stimulateMotor();
      this.turn();
      this.digest();
    }

    this.collision();
    
    this.appleSensors.update();
    this.bodySensors.update();
    this.wallSensors.update();
  }

  draw(ctx) {
    
    if(this.isDead) return;
    const color = 'lightgreen';
    
    ctx.beginPath();
    ctx.rect(this.head.x, this.head.y, 32, 32);
    ctx.fillStyle = color;
    ctx.fill();
    this.body.forEach((part) => {
      ctx.beginPath();
      ctx.rect(part.x, part.y, part.width, part.height);
      ctx.fillStyle= color;
      ctx.fill();
    });
    this.apple.draw(ctx);
    // this.appleSensors.draw(ctx, 'yellow');
    // this.bodySensors.draw(ctx, 'blue');
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
    //this.stimulateMotor();
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
    this.fitness += 1;
    if(this.head.x === chunkify(this.head.x, this.head.width) && this.head.y === chunkify(this.head.y, this.head.height)) {
      return true;
    }
    return false;
  }

  consume() {
    this.fitness += 100;
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

  collision() {
    //check if snake ate apple
    if(
      this.head.x < this.apple.x + this.apple.width &&
      this.head.x + this.head.width > this.apple.x &&
      this.head.y < this.apple.y + this.apple.height &&
      this.head.y + this.head.height > this.apple.y
    ) {
      this.consume();
      this.apple.respawn(this.boardWidth, this.boardHeight);
      //make sure the apple doesn't spawn inside the snake
      let appleInSnake = true;
      while(appleInSnake) {
        appleInSnake = false;
        if(this.apple.x === this.head.x && this.apple.y === this.head.y) {
          appleInSnake = true;
          this.apple.respawn(this.boardWidth, this.boardHeight);
        } else {
          for(let i = 0; i < this.body.length; i++) {
            const part = this.body[i];
            if(this.apple.x === part.x && this.apple.y === part.y) {
              appleInSnake = true;
              this.apple.respawn(this.boardWidth, this.boardHeight);
              break;
            }
          }
        }
      }
    } else if( //check if snake is out of boundary
      this.head.x < 0 ||
      this.head.x + this.head.width > this.boardWidth ||
      this.head.y < 0 ||
      this.head.y + this.head.height > this.boardHeight
    ) {
      this.isDead = true;
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
        this.isDead = true;
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
  }

  straighten() {
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
      for(let i = 1; i < this.body.length; i++) {
        switch(this.body[i-1].direction) {
          case 'up':
            this.body[i].y = this.body[i-1].y + this.body[i-1].height;
            break;
          case 'down':
            this.body[i].y = this.body[i-1].y - this.body[i-1].height;
            break;
          case 'left':
            this.body[i].x = this.body[i-1].x + this.body[i-1].width;
            break;
          case 'right':
            this.body[i].x = this.body[i-1].x - this.body[i-1].width;
            break;
        }
      }
    }
  }
}