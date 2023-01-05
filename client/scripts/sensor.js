class Sensor {
  constructor(rayCount, anchor, target) {
    this.anchor = anchor;
    this.target = target;
    this.rays = Array.from(rayCount);
    for(let i = 0; i < rayCount; i++) {
      const angleSegment = (2*Math.PI)/rayCount;
      console.log('angleSegment', angleSegment * i)
      this.rays[i] = this.getSensorCoord(this.anchor, this.target, angleSegment * i);
    }
  }

  update() {
    for(let i = 0; i < this.rays.length; i++) {
      const angleSegment = (2*Math.PI)/this.rays.length;
      this.rays[i] = this.getSensorCoord(this.anchor, this.target, angleSegment * i);
    }
  }

  draw(ctx, color) {
    this.rays.forEach(ray => {
      ctx.beginPath();
      const [A, B] = ray;
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(B.x, B.y);
      ctx.strokeStyle = color;
      ctx.stroke();
    });
  }

  getSensorCoord(origin, target, angle) {
    const A = {
      x: (origin.x + origin.width/2),
      y: (origin.y + origin.height/2)
    };
    
    const B = {
      x: (origin.x + origin.width/2) + Math.cos(angle) * 1000,
      y: (origin.y + origin.height/2) + Math.sin(angle) * 1000
    };

    const Cx = {
      x: target.x,
      y: target.y + target.height/2,
    };

    const Cy = {
      x: target.x + target.width/2,
      y: target.y,
    }

    const Dx = {
      x: target.x + target.width,
      y: target.y + target.height/2,
    }

    const Dy = {
      x: target.x + target.width/2,
      y: target.y + target.height
    };

    const intersectionX = getIntersection(A,B,Cx,Dx);
    const interSectionY = getIntersection(A,B,Cy,Dy);
    const intersection = intersectionX.offset > interSectionY.offset ? intersectionX : interSectionY;

    return [A, intersection];
  }
}