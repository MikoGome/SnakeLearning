function chunkify(position, chunk) {
  return position - position%chunk;
}

function lerp(a,b,t) {
  return a + (b-a) * t;
}