var _ = require('underscore'),
    numeric = require ('numeric');

// The class implements exploration policy base on 
// Boltzmann distribution. Acording to the policy, 
// action a at state s is selected with the next probability
//                   exp( Q( s, a ) / t )       exp( A )
// p( s, a ) = ----------------------------- = ----------
//              SUM( exp( Q( s, b ) / t ) )        B
// where Q(s, a) is action's a estimation (usefulness) 
// at state s and t is Temperature.

var BoltzmannExploration = function(temperature){
  this.temperature =  temperature? temperature : 0.25;
};
BoltzmannExploration.prototype.getProbabilities = function(actionEstimates) {
  var A = numeric.dot(actionEstimates, 1 / this.temperature);
  var expA = numeric.exp(A);
  var B = _.reduce( expA, function(memo, q) {return memo + q;});
  return numeric.dot(expA, 1 / B);
};
BoltzmannExploration.prototype.chooseAction = function(actionEstimates) {
  var nbActions = actionEstimates.length;
  var prob = this.getProbabilities(actionEstimates);
  var rand = Math.random();
  var sum = 0;
  for (var i = 0; i < nbActions; i++){
    sum += prob[i];
    if (rand <= sum){
      return i;
    }
  }
  return nbActions - 1;
};


exports.BoltzmannExploration = BoltzmannExploration;