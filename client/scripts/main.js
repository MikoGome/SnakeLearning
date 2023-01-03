function main() {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const board = new Board(canvas.width, canvas.height);
  let prevTime = null;
  animate(performance.now());
  function animate(time) {
    if(prevTime && time - prevTime < 1000/60) return requestAnimationFrame(animate);
    board.update();
    board.draw(ctx);
    prevTime = performance.now();
    requestAnimationFrame(animate);
  }
}



main();