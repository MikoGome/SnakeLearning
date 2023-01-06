class Controls {
  constructor() {
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.#attachControls();
  }

  #attachControls() {
    document.addEventListener('keydown', (e) => {
      switch(e.key.toLowerCase()) {
        case 'arrowup':
          this.turnOff();
          this.up = true;
          break;
          case 'arrowdown':
          this.turnOff();
          this.down = true;
          break;
          case 'arrowleft':
          this.turnOff();
          this.left = true;
          break;
          case 'arrowright':
          this.turnOff();
          this.right = true;
          break;
        default:
          return;
      }
    });
  }

  turnOff() {
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
  }
}