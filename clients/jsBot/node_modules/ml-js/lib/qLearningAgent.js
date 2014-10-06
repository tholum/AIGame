var util = require('util'),
    events  = require('events'),
    _ = require('underscore'),
    explPolicies = require ('./explorationPolicies');

var QLearningAgent = function(args){
  events.EventEmitter.call(this);
  args = args ? args : {};
  this._qValues = args.qValues ? args.qValues : {};
  this._actions = args.actions ? args.actions : [];
  this.learningRate = args.learningRate ? args.learningRate : 0.1;
  this.discountFactor = args.discountFactor ? args.discountFactor : 0.9;
  this.explorationFolicy = args.explorationPolicy ? args.explorationPolicy : new explPolicies.BoltzmannExploration();

};

util.inherits(QLearningAgent, events.EventEmitter);

QLearningAgent.prototype.getAction = function(state) {
  // body...
  var actionValues = _.pluck(this._qValues.getActionValues(state), 'v');
  return this.explorationFolicy.chooseAction(actionValues);
};

QLearningAgent.prototype.learn = function(initState, action, newState, reward, callback) {
  if (typeof callback === 'function'){
    this.once('learned-once', callback);
  }
  var initValue = this._qValues.getValue(initState, action);
  var bestNextActionValue =  this._qValues.getBestActionValue(newState);
  var newValue = (1 - this.learningRate) * initValue + this.learningRate * (reward + this.discountFactor * bestNextActionValue);
  var e = this._qValues.updateValue(initState, action, newValue);
  this.emit('learned-once', {
    initValue: initValue,
    newValue: newValue,
    epoch: e
  });
};
exports.QLearningAgent = QLearningAgent;
