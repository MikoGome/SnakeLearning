class Sensor {
  constructor(sensorsCount, anchor, target) {
    this.anchor = anchor;
    this.target = target;
    this.sensors = Array.from(sensorsCount);
    for(let i = 0; i < sensorsCount; i++) {
      this.sensors[i] = this.getSensorCoord(this.target, Math.PI/4 * i);
    }
  }

  update() {
    for(let i = 0; i < this.sensors.length; i++) {
      this.sensors[i] = this.getSensorCoord(this.target, Math.PI/4 * i);
    }
  }

  draw(ctx, color) {
    this.sensors.forEach(sensor => {
      ctx.beginPath();
      const {x, y, width, height} = this.anchor;
      ctx.moveTo(x + width/2, y + height/2);
      ctx.lineTo(sensor.x, sensor.y);
      ctx.strokeStyle = color;
      ctx.stroke();
    });
  }

  getSensorCoord(target, angle) {

    //stumped will come back
    const width = 1216;
    const height = 800;
    const xAngle = Math.cos(angle);
    const yAngle = Math.sin(angle);
    let length = 2000;
    // if(angle > Math.PI * 0 && angle < Math.PI/2) {
    //   const xLength = width - this.anchor.x;
    //   const yLength = height - this.anchor.y;
    //   length = Math.sqrt(xLength ** 2 + yLength ** 2)//Math.max(xLength, yLength);
    // } else if(angle > Math.PI/2 && angle < Math.PI) {
    //   const xLength = width - this.anchor.x;
    //   const yLength = height - this.anchor.y;
    //   length = Math.max(xLength, yLength);
    // } else if(angle > Math.PI && angle < Math.PI*3/2) {
    //   const xLength = this.anchor.x;
    //   const yLength = height - this.anchor.y;
    //   length = Math.max(xLength, yLength);
    // } else if(angle > Math.PI*3/2 && angle < Math.PI * 2) {
    //   const xLength = this.anchor.x;  
    //   const yLength = this.anchor.y;
    //   length = Math.max(xLength, yLength);
    // } else if(angle === Math.PI * 0) {
    //   length = width - this.anchor.x - this.anchor.width/2;
    // } else if(angle === Math.PI/2) {
    //   length = height - this.anchor.y - this.anchor.height/2;
    // } else if(angle === Math.PI) {
    //   length = this.anchor.x + this.anchor.width/2;
    // } else if(angle === Math.PI * 3/2) {
    //   length = this.anchor.y + this.anchor.height/2;
    // }
    const x = xAngle * length + this.anchor.x + this.anchor.width/2;
    const y = yAngle * length + this.anchor.y + this.anchor.height/2;
    const output = {
      x,
      y,
    }
    // console.log(target.y, this.anchor.y)

    switch(angle) {
      case Math.PI/4 * 0:
        if(
          y < target.y + target.height && 
          y > target.y &&
          this.anchor.x < target.x
        ) {
          const x = target.x + target.width;
          output.x = x;
        }
        break;
      case Math.PI/4 * 2:
        if(
          x < target.x + target.width && 
          x > target.x &&
          this.anchor.y < target.y
        ) {
          const y = target.y;
          output.y = y;
        }
        break;
      case Math.PI/4 * 4:
        if(
          y < target.y + target.height && 
          y > target.y &&
          this.anchor.x > target.x
        ) {
          const x = target.x + target.width;
          output.x = x;
        }
        break;
      case Math.PI/4 * 6:
        if(
          x < target.x + target.width && 
          x > target.x &&
          this.anchor.y > target.y+target.height
        ) {
          const y = target.y + target.height;
          output.y = y;
        }
        break;
      case Math.PI/4 * 1:
      case Math.PI/4 * 5:
        if(
          this.anchor.x + target.y - this.anchor.y === target.x &&
          this.anchor.y + target.x - this.anchor.x === target.y
        ) {
          console.log("hit")
        }
        break;
      case Math.PI/4 * 3:
      case Math.PI/4 * 7:
        //work this out later
        break;
    }
    return output;
  }
}