class NeuralNetwork {

}

class Level {
  constructor(inputCount, outputCount) {
    this.biases = Array(outputCount);
    this.weights = Array(inputCount).fill(0).map(() => Array(outputCount));

    for(let i = 0; i < outputCount; i++) {
      this.biases[i] = Math.random() * 2 - 1;
    }

    for(let i = 0; i < inputCount; i++) {
      for(let j = 0; j < outputCount; j++) {
        this.weights[i][j] = Math.random() * 2 - 1;
      }
    }
  }

  feedForward(inputs) {
    const outputs = [];
    for(let i = 0; i < this.biases.length; i++) {
      let sum = 0;
      for(let j = 0; j < inputs.length; j++) {
        sum += inputs[j] * this.weights[j][i];
      }
      
      if(sum > this.biases[i]) {
        outputs[i] = 1;
      } else {
        outputs[i] = 0;
      }
    }
    return outputs;
  } 
}