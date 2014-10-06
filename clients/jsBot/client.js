var ml = require('ml-js');
/*
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


*/
