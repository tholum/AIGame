ml-js
====

Machine Learning library for Node.js

Status : Under development

[![NPM](https://nodei.co/npm/ml-js.png?downloads=true)](https://nodei.co/npm/ml-js/)

## Installation
ml-js depends on [FANN](http://leenissen.dk/fann/wp/) (Fast Artificial Neural Network Library) witch is a free, open source and high performence neural network library.

To build great app with it : 
* Make sure you glib2 is installed  : `sudo apt-get install glib2.0`
* make sure pkg-config is installed : `sudo apt-get install pkg-config`
* make sure cmake is installed      : `sudo apt-get install cmake`
* Install FANN : 
  * download  [here](http://leenissen.dk/fann/wp/download/)
  * unzip
  * goto to FANN directory
  * run `cmake .` and `sudo make install`
  * run `sudo ldconfig`

Finally, you should be able to install all npm dependancies with  `npm install ml-js --save`

## Supported ML techniques
ml-js currently supports : 
* Supervised learning :
  * `fann` - Neural Networks provided by [node-fann](https://github.com/rlidwka/node-fann) addon
  * `svm`  - Support vector machine provided by [node-svm](https://github.com/nicolaspanel/node-svm) addon
* Reinforcement learning :
  * `QLearning`, model-free reinforcement learning technique
*  Exploration policies
  * `BoltzmannExploration`

## Getting started

### QLearning Example
[Q-learning](http://en.wikipedia.org/wiki/Q-learning) is a model-free reinforcement learning technique. Specifically, Q-learning can be used to find an optimal action-selection policy for any given [MDP](http://en.wikipedia.org/wiki/Markov_decision_process).

```coffeescript
ml = require 'ml-js'

myprocess = new SomeProcess

qValues = new ml.CSDAQValues nb_features, nb_actions

options = {
  learning_rate: 0.1
  discount_factor: 0.9
  exploration_policy: new ml.BoltzmannExploration 0.2 # temperature
}
agent = new ml.QLearningAgent qValues, options

myprocess.on 'do_something', (currentState)->
  next_action = agent.getAction currentState
  myprocess.do next_action
  
myprocess.on 'feedback_received', (initState, action, newState, reward)->
    agent.learn initState, action, newState, reward
```

Availables QValues managers : 
 * `CSDAQValues` for  Continuous States and Discrete Actions QValues. It uses neural networks to perform learning on continuous states.  