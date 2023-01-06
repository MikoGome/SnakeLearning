class Population {
  constructor(size, board) {
    console.log('board', board);
    this.board= board;

    this.players = Array(size).fill(null).map(() => new Snake(this.board.width, this.board.height, this.board.chunk));

    this.generation = 1;
    this.fitnessSum = 0;
    this.champion = null;
  }

  see() {
    this.players.forEach(player => {
      player.see(this.board);
    })
  }

  update() {
    this.see();
    this.players.forEach(player => {
      player.update();
    })
    if(this.checkExtinction()) { //if all players are dead
      this.sortPlayersAndSetChampion();
      this.breed();
    }
  }

  draw(ctx) {
    let bestLiving = 0;
    for(let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      if(i === bestLiving) {
        if(player.isDead) {
          bestLiving += 1;
          continue;
        }
        player.draw(ctx);
      }
    }
  }

  stimulateMotors() {
    this.players.forEach(player => {
      player.stimulateMotor();
    })
  }

  //genetic methods
  checkExtinction() {
    for(let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      if(!player.isDead) {
        return false;
      }
    }
    return true;
  }

  calculateFitnessSum() {
    return this.players.reduce((acc, curr) => {
      return acc + curr.fitness;
    }, 0);
  }

  chooseParentBrain() {
    let runningSum = 0;
    const fitnessSum = this.calculateFitnessSum();
    const fitnessBar = Math.random() * fitnessSum;
    for(let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      runningSum += player.fitness;
      if(runningSum > fitnessBar) {
        return player.brain;
      }
    }
    console.log('should not get to this point');
    return null;
  }

  sortPlayersAndSetChampion() {
    this.players.sort((a,b) => b.fitness - a.fitness);
    this.champion = this.players[0];
  }

  breed() {
    const children = [];
    children.push(this.champion);
    for(let i = 1; i < this.players.length; i++) {
      const childBrain = deepClone(this.chooseParentBrain());
      const child = new Snake(this.board.width, this.board.height, this.board.chunk);
      childBrain.mutate(1);
      child.brain = childBrain;
      children.push(child);
    }
    this.players = children;
    this.generation+=1;
  }
}