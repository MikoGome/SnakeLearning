class NeuralNetwork {
  constructor(neuronCounts) {
    this.levels = [];
    if(neuronCounts) {
      for(let i = 0; i < neuronCounts.length-1; i++) {
        const lowerLevelLength = neuronCounts[i];
        const upperLevelLength = neuronCounts[i + 1];
        this.levels.push(new Level(lowerLevelLength, upperLevelLength));
      }
    }
  }

  feedForward(inputs) {
    let outputs = this.levels[0].feedForward(inputs);
    for(let i = 1; i < this.levels.length; i++) {
      outputs = this.levels[i].feedForward(outputs);
    }
    return outputs;
  }

  mutate(amount) {
    this.levels.forEach(level => {
      for(let i = 0; i < level.biases.length; i++) {
        level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount);
      }

      for(let i = 0; i < level.weights.length; i++) {
        for(let j = 0; j < level.weights[i].length; j++) {
          level.weights[i][j] = lerp(level.weights[i][j], Math.random() * 2 - 1, amount);
        }
      }
    });
  }
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