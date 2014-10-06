var util = require('util'),
    events  = require('events'),
    _ = require('underscore'),
    numeric = require('numeric'),
    async = require('async');

/**
Classification Evaluator aims to check your classificator's accuracy/precision/recall/fscore.

NOTICE : ClassificationEvaluator assumes your inputs  
are properly normalized between 0 and 1 
*/
var ClassificationEvaluator = function  (classifier) {
  events.EventEmitter.call(this);
  this.classifier = classifier;
};
util.inherits(ClassificationEvaluator, events.EventEmitter);
ClassificationEvaluator.prototype._computeFScore = function(precision, recall) {
  if (recall === 0 && precision === 0){
    return 0;
  } 
  return 2 * recall * precision / (recall + precision);
};

ClassificationEvaluator.prototype._trainAndEvaluateSet = function(set) {
  var classifier = _.clone(this.classifier);
  if (set.trainning.length > 0){
    classifier.train(set.trainning);
  }
  var labels = _.uniq(_.pluck(set.test, 'expected'));
  
  var nb_labels = labels.length;
  var nb_examples = set.test.length;
  var results = numeric.rep([nb_labels,nb_labels],0);
  var onces = numeric.rep([nb_labels,1],1);

  var getIndex = function(label){
    var index = _.indexOf(labels, label);
    if (index === -1){ //label existing in trainning set but not in test set
      labels.push(label);
      index = nb_labels;
      _.range(nb_labels).forEach(function(i){
        results[i][index] = 0;
      });
      nb_labels++;
      results[index] = numeric.rep([1,nb_labels],0);
    }
    return index;
  };
  
  set.test.forEach(function(example){
    var prediction = classifier.predict(example.state);
    results[getIndex(prediction)][getIndex(example.expected)] += 1;
  });

  var sum_predictions = numeric.dot(results, onces);
  var sum_expected = numeric.dot(numeric.transpose(results) , onces);

  var per_class_reports = [];
  var nb_good_prediction = 0;
  
  var self = this;
  labels.forEach(function (label) {
    var label_index = getIndex(label);
    var TP = results[label_index][label_index];
    
    var precision = 0;
    var recall = 0;
    if (TP !== 0){
      precision =  TP / sum_predictions[label_index];
      recall = TP / sum_expected[label_index];
    }
      
    nb_good_prediction+=TP;
    var classResult = {
      class: label,
      precision: precision,
      recall: recall,
      fscore: self._computeFScore(precision, recall)
    };
    per_class_reports.push(classResult);
  });
  var classReports = {};
  per_class_reports.forEach(function (r) {
    classReports[r.class] = {
      precision: r.precision,
      recall: r.recall,
      fscore: r.fscore
    };
  });
  return {
    accuracy: nb_good_prediction / nb_examples,
    lowestFscore: _.min(_.pluck(per_class_reports, 'fscore')),
    lowestPrecision: _.min(_.pluck(per_class_reports, 'precision')),
    lowestRecall: _.min(_.pluck(per_class_reports, 'recall')),
    classReports: classReports
  };
};
  
  
/**
NOTICE : this function assumes your classifier is already trained 
*/
ClassificationEvaluator.prototype.evaluate = function(test_set, callback){
  if (typeof callback === 'function'){
    this.once('done', callback);
  }
  this.performKFoldCrossValidation(1, test_set);
};

ClassificationEvaluator.prototype.performKFoldCrossValidation = function(kfold, data_set, callback) {
  if (typeof callback === 'function'){
    this.once('done', callback);
  }
  var data = _.shuffle(data_set);

  var nb_example_per_subset = Math.floor(data.length / kfold);
  var data_subsets = [];
  var k = 0;
  var i = 0, j=0;
  for (i = 0; i < kfold; i++){
    var subset = data.slice(k, k + nb_example_per_subset);
    k += nb_example_per_subset;
    data_subsets.push(subset);
  }
  
  var _sets = [];
  for (i = 0; i < kfold; i++){
    var i_trainning_set = [];
    
    for (j = 0; j < kfold; j++){
      if(j !== i){
        i_trainning_set = i_trainning_set.concat(data_subsets[j]);
      }
    }
    
    _sets.push({ 
      trainning: i_trainning_set,
      test: data_subsets[i]
    });  
  }
  

  var set_reports = [];
  var self = this;
  
  async.each(_sets, function(set, done){
    var r = self._trainAndEvaluateSet(set);
    set_reports.push(r);
    done();
  }, function(err){
    var sumAccuracies = 0, 
        sumFScores = 0,
        sumPrecisions = 0,
        sumRecall = 0;
    set_reports.forEach(function(r){
      sumAccuracies+=r.accuracy;
      sumFScores += r.lowestFscore;
      sumPrecisions += r.lowestPrecision;
      sumRecall += r.lowestRecall;
    });
    self.emit('done', {
      kfold: kfold,
      averageAccuracy: sumAccuracies / kfold,
      averageFscore: sumFScores / kfold,
      averagePrecision: sumPrecisions / kfold,
      averageRecall: sumRecall / kfold,
      subsetsReports: set_reports
    });
  });  
};    
exports.ClassificationEvaluator = ClassificationEvaluator;