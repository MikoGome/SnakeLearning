class Sensor {
  constructor(rayCount, origin, target, boundary) {
    this.origin = origin;
    this.target = target;
    this.boundary = boundary;
    this.rays = Array.from(rayCount);
    for(let i = 0; i < rayCount; i++) {
      const angleSegment = (2*Math.PI)/rayCount;
      this.rays[i] = this.getSensorCoord(angleSegment * i);
    }
  }

  update() {
    for(let i = 0; i < this.rays.length; i++) {
      const angleSegment = (2*Math.PI)/this.rays.length;
      this.rays[i] = this.getSensorCoord(angleSegment * i);
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

  getSensorCoord(angle) {
    const boundaryWidth = this.boundary.width - this.origin.width/2;
    const boundaryHeight = this.boundary.height - this.origin.height/2;

    const boundaryDiag = Math.sqrt(boundaryWidth ** 2 + boundaryHeight ** 2);

    const A = {
      x: (this.origin.x + this.origin.width/2),
      y: (this.origin.y + this.origin.height/2)
    };
    
    const B = {
      x: (this.origin.x + this.origin.width/2) + Math.cos(angle) * (angle === 0 || angle === Math.PI/2 || angle === Math.PI || angle === 3 * Math.PI /2 ? boundaryWidth : boundaryDiag),
      y: (this.origin.y + this.origin.height/2) + Math.sin(angle) * (angle === 0 || angle === Math.PI/2 || angle === Math.PI || angle === 3 * Math.PI /2 ? boundaryHeight : boundaryDiag)
    };

    if(Array.isArray(this.target)) {
      for(let i = 0; i < this.target.length; i++) {
        const Cx = {
          x: this.target[i].x,
          y: this.target[i].y + this.target[i].height/2,
        };
    
        const Cy = {
          x: this.target[i].x + this.target[i].width/2,
          y: this.target[i].y,
        }
    
        const Dx = {
          x: this.target[i].x + this.target[i].width,
          y: this.target[i].y + this.target[i].height/2,
        }
    
        const Dy = {
          x: this.target[i].x + this.target[i].width/2,
          y: this.target[i].y + this.target[i].height
        };
    
        const intersectionX = getIntersection(A,B,Cx,Dx);
        const intersectionY = getIntersection(A,B,Cy,Dy);
        const intersection = intersectionX.offset < intersectionY.offset ? intersectionX : intersectionY;
        if(intersection.intersecting ) {
          return [A, intersection];
        }
      }
      return [A, {
        ...B,
        offset: 1,
        intersecting: false
      }]
    } else if(this.target !== this.boundary) {
      const Cx = {
        x: this.target.x,
        y: this.target.y + this.target.height/2,
      };
  
      const Cy = {
        x: this.target.x + this.target.width/2,
        y: this.target.y,
      }
  
      const Dx = {
        x: this.target.x + this.target.width,
        y: this.target.y + this.target.height/2,
      }
  
      const Dy = {
        x: this.target.x + this.target.width/2,
        y: this.target.y + this.target.height
      };
  
      const intersectionX = getIntersection(A,B,Cx,Dx, angle);
      const intersectionY = getIntersection(A,B,Cy,Dy, angle);
      const intersection = intersectionX.offset < intersectionY.offset ? intersectionX : intersectionY;
  
      return [A, intersection];
    } else {
      const CxTop = {
        x: this.target.x,
        y: 0
      };

      const CxBottom = {
        x: this.target.x,
        y: this.target.height,
      }
  
      const CyLeft = {
        x: 0,
        y: 0,
      }

      const CyRight = {
        x: this.target.width,
        y: 0
      }
  
      const DxTop = {
        x: this.target.x + this.target.width,
        y: 0
      }

      const DxBottom = {
        x: this.target.x + this.target.width,
        y: this.target.height
      }
  
      const DyLeft = {
        x: 0,
        y: this.target.y + this.target.height
      };

      const DyRight = {
        x: this.target.width,
        y: this.target.height
      };

      const intersectionLeft = getIntersection(A,B,CyLeft,DyLeft);
      const intersectionRight = getIntersection(A,B,CyRight,DyRight);
      const intersectionTop = getIntersection(A,B,CxTop,DxTop);
      const intersectionBottom = getIntersection(A,B,CxBottom, DxBottom);
      const intersection =  [intersectionLeft, intersectionRight, intersectionTop, intersectionBottom].reduce((acc, curr) => {
        if(curr.offset < acc.offset) {
          return curr;
        } 
        return acc;
      });
      return [A, intersection];
    }
  }
}