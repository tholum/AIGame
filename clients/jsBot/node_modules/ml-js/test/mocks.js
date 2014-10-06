'use strict';
var util = require('util'),
    events  = require('events'),
    _ = require('underscore'),
    sinon = require('sinon');

var MockQValues = function(args) {
  events.EventEmitter.call(this);
  // arguments
  args = args ? args : {};
  this.nbFeatures = args.nbFeatures ?  args.nbFeatures : NaN;
  var actions = args.actions ? args.actions : [];
  var result = _.map(actions, function(a){return 0;});
  this.nbAction = actions.length;
  this.getValue = sinon.stub().returns(0);
  this.updateValue = sinon.spy();

  this.getActionValues = sinon.stub().returns(result);
  this.getBestAction = sinon.stub().returns(actions[0]);
  this.getBestActionValue = sinon.stub().returns(1);
};
util.inherits(MockQValues, events.EventEmitter);

var MockExplorationPolicy = function(){
  this.getProbabilities = sinon.stub();
  this.getProbabilities.withArgs([]).returns([]);
  this.getProbabilities.withArgs([0]).returns([1]);
  this.getProbabilities.withArgs([0, 1]).returns([0, 1]);

  this.chooseAction = sinon.stub().returns(0);
};

exports.QValues = MockQValues;
exports.ExplorationPolicy = MockExplorationPolicy;