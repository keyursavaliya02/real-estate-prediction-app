import brain from 'brain.js';
import data from '../data/data.json' assert { type: "json" };
import data from './data/data.json';
import fs from 'fs';

// Preprocess data
const trainingData = data.map(item => ({
  input: {
    area: item.area / 5000, // Normalize
    bedrooms: item.bedrooms / 10,
    bathrooms: item.bathrooms / 10,
    age: item.age / 100
  },
  output: { price: item.price / 1000000 } // Normalize price
}));

// Initialize neural network
const net = new brain.NeuralNetwork({ hiddenLayers: [5, 5] });

// Train model
net.train(trainingData, {
  iterations: 20000,
  log: true,
  logPeriod: 500,
  learningRate: 0.01
});

// Save model
const modelJson = JSON.stringify(net.toJSON(), null, 2);
fs.writeFileSync('./model.json', modelJson);

console.log('Model trained and saved!');
