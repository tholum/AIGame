var util = require('util'),
    fann = require('fann'),
    _ = require ('underscore'),
    events  = require('events');


var CSDAQValues = function(args){
  events.EventEmitter.call(this);
  args = args ? args : {};
  this.nbFeatures = args.nbFeatures ?  args.nbFeatures : NaN;
  this._actions = args.actions ? args.actions : [];
  this._actionsIndexes = {};
  this.nets = [];
  var hiddenLayerSize = this.nbFeatures + 1;
  var i=0;
  var self = this;
  this._actions.forEach(function(a){
    self._actionsIndexes[a] = i;
    var net = new fann.standard(self.nbFeatures, hiddenLayerSize , 1);
    net.training_algorithm = "incremental";
    self.nets.push(net);
    i++;
  }); 
};
util.inherits(CSDAQValues, events.EventEmitter);


CSDAQValues.prototype.getValue = function(state, action) {
  var actionIndex = this._actionsIndexes[action];
  return this.nets[actionIndex].run(state)[0];
};

CSDAQValues.prototype.getActionValues = function(state) {
  return _.map(this._actions, function(a){
    return {
      a: a,
      v: this.getValue(state, a)
    };
  }.bind(this));
};

CSDAQValues.prototype.getBestAction = function(state) { 
  return _.max(this.getActionValues(state), function(av){ return av.v; }).a;
};

CSDAQValues.prototype.getBestActionValue = function(state) { 
  return _.max(this.getActionValues(state), function(av){ return av.v; }).v;
};

CSDAQValues.prototype.updateValue = function(state, action, value, callback) {
  if (typeof callback === 'function'){
    this.once('updated', callback);
  }
  var actionIndex = this._actionsIndexes[action];
  var oldValue = this.nets[actionIndex].run(state)[0];
  this.nets[actionIndex].train_once(state, [value]);
  var newValue = this.nets[actionIndex].run(state)[0];
  this.emit('updated', {
    oldValue: oldValue,
    newValue: newValue,
    mse: Math.pow(oldValue - value, 2) / 2
  });
};

exports.CSDAQValues = CSDAQValues;