var should = require ('should'),
    _ = require ('underscore'),
    ml = require ('../bin/ml');


describe ('Continuous State Discrete Actions QValues', function(){
  var qValues = null;
  var updated_xor = [
    //  A, B, a -> reward
    {state: [0, 0], action: 0, reward: 1}, // reward = 1 because 0 XOR 0 == 0
    {state: [0, 0], action: 1, reward: 0}, // reward = 0 because 0 XOR 0 != 1 
    {state: [0, 1], action: 0, reward: 0},
    {state: [0, 1], action: 1, reward: 1},
    {state: [1, 0], action: 0, reward: 0},
    {state: [1, 0], action: 1, reward: 1},
    {state: [1, 1], action: 0, reward: 1},
    {state: [1, 1], action: 1, reward: 0}
  ];

  beforeEach(function() {
    qValues = new ml.CSDAQValues({
      nbFeatures: 2,
      actions: _.pluck(updated_xor, 'action')
    });
  });

  it('should return learning info after learning', function(done){
    var state = [0, 0];
    var action = 1;
    var currentValue = qValues.getValue(state, action);
    var newValue = 1;
    
    qValues.updateValue(state, action, newValue, function (info) {
      info.oldValue.should.equal(currentValue);
      info.newValue.should.be.within(currentValue, newValue);
      info.mse.should.equal(Math.pow(currentValue - newValue, 2) / 2);
      done();
    });
  });

  describe('when trainned with xor example', function  () {
    beforeEach(function () {
      var range = _.range(5000);
      range.forEach(function(i){
        updated_xor.forEach(function(ex){
          qValues.updateValue(ex.state, ex.action, ex.reward);
        });
      });          
    });
    
    it('should predict 0 to be a good choice for 0 XOR 0 (prob ~ 1)', function () {
      qValues.getValue([0, 0], 0).should.be.approximately (1.0, 1e-1);
    });
      

    it('should predict 1 to be a bad choice for 0 XOR 0 (prob ~ 0)', function  () {
      qValues.getValue([0, 0], 1).should.be.approximately(0.0, 1e-1);
    });

    it('should predict 1 to be a good choice for 0 XOR 1', function  () {
      qValues.getValue([0, 1], 1).should.be.approximately(1.0, 1e-1);
    });

    it ('should predict 0 to be a bad choice for 0 XOR 1', function () {
      qValues.getValue([0, 1], 0).should.be.approximately(0.0, 1e-1);
    });

    it ('should predict 0 as the best action (i.e. result) for 0 XOR 0', function  () {
      qValues.getBestAction([0,0]).should.equal(0);
    });

    it ('should predict 1 as the best action (i.e. result) for 0 XOR 1', function  () {
      qValues.getBestAction([0,1]).should.equal(1);
    });


    it ('should predict 1 as the best action (i.e. result) for 1 XOR 0', function  () {
      qValues.getBestAction([1,0]).should.equal(1);
    });

    it ('should predict 0 as the best action (i.e. result) for 1 XOR 1', function  () {
      qValues.getBestAction([1,1]).should.equal(0);
    });
  });
});
