require("coffee-script");
exports.fann = require('fann');
exports.svm = require('node-svm');

// Q-Values
exports.CSDAQValues = require('../lib/qValues').CSDAQValues;

// Explorations policies
exports.BoltzmannExploration = require('../lib/explorationPolicies').BoltzmannExploration;

// Reinforcement learning
exports.QLearningAgent = require('../lib/qLearningAgent').QLearningAgent;

// Analysis
exports.ClassificationEvaluator = require('../lib/classificationEvaluator').ClassificationEvaluator;