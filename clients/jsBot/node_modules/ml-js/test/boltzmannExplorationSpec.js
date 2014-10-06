var assert = require('assert'),
    should = require('should'),
    _ = require ('underscore'),
    ml = require ('../bin/ml'),
    mocks = require('./mocks');


describe ('Boltzmann Exploration Policy', function(){
  var expl = null;
  beforeEach(function(){
    expl = new ml.BoltzmannExploration(0.25);
  });
    

  it ('should have temperature set to 0.25', function(){
    expl.temperature.should.equal (0.25);
  });
    
  it ('should return [0.5, 0.5] when asking probabilities for [0.5,0.5]', function (){
    expl.getProbabilities([0.5, 0.5]).should.eql([0.5, 0.5]);
  });
    
  it ('should return approximately [0, 1] when asking probabilities for [0,1]', function(){
    var prob = expl.getProbabilities([0, 1]);
    prob[0].should.approximately (0, 2e-2);
    prob[1].should.approximately (1, 2e-2);
  });
    
  it ('should return values ​​whose sum must be equal to 1', function(){
    var prob = expl.getProbabilities([0.85, 0.9]);
    _.reduce( prob, function(sum, val){return sum + val;}).should.be.approximately(1, 1e-5);
  });
    
  it ('should return 1 when choose action with [0,1]', function(){
    expl.chooseAction([0, 1]).should.equal(1);
  });
  
  it ('should return 0 when choose action with [1,0]', function(){
    expl.chooseAction([1, 0]).should.equal(0);
  });
});
  