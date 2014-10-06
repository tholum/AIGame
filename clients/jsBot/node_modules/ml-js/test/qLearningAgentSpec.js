var assert = require('assert'),
    should = require('should'),
    _ = require ('underscore'),
    ml = require ('../bin/ml'),
    mocks = require('./mocks');


describe ('QLearning Agent', function  () {
  var agent = null;
  var explPolicy = null;
  var qvalueManager = null;
  
  beforeEach(function () {
    explPolicy = new mocks.ExplorationPolicy();
    qvalueManager = new mocks.QValues({
      nbFeatures: 2,
      actions: [0,1]
    });
    agent = new ml.QLearningAgent({
      qValues: qvalueManager,
      explorationPolicy: explPolicy,
      actions: [0,1],
      learningRate: 0.1,
      discountFactor: 0.9
    });
  });
    
  it ('should have \'learning_rate\' property set to 0.1', function(){
    agent.learningRate.should.equal(0.1);
  });
    
    
  it ('should have \'discount_factor\' property set to 0.9', function(){
    agent.discountFactor.should.equal(0.9);
  }); 

  it ('should call qvalue update when learn a new example', function(done){
    var initState = [0,0], 
        action= 0, 
        newState = [0,0], 
        reward = 1.0;
    var expectedNewValue = (1.0 - 0.1) * 0 + 0.1 * (1 + 0.9 * 1);
    agent.learn(initState, action, newState, reward, function(info){
      qvalueManager.updateValue.calledWith(initState, action, expectedNewValue).should.be.true;
      done();
    });
  }); 

  it ('should call use exploration policy to get next action', function(){
    var state = [0,0];
    agent.getAction([0,0]).should.equal(0);
    explPolicy.chooseAction.calledOnce.should.be.true;
  });  
});
