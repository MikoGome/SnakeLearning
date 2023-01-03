function chunkify(position, chunk) {
  return position - position%chunk;
}