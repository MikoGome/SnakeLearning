class NeuralNetwork {

}

class Level {
  constructor(inputCount, outputCount) {
    const biases = Array(outputCount);
    const weights = Array(inputCount).fill(0).map(() => Array(outputCount));

    for(let i = 0; i < outputCount; i++) {
      biases = Math.random() * 2 - 1;
    }

    for(let i = 0; i < inputCount; i++) {
      for(let j = 0; j < outputCount; j++) {
        weights[i][j] = Math.random() * 2 - 1;
      }
    }
  }

  feedForward() {

  } 
}