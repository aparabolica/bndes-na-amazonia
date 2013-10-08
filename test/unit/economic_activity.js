/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , should = require('should')
  , mocha = require('mocha')
  , model = require('../../app/models/economic_activity')
  , context = describe
  , EconomicActivity = mongoose.model('EconomicActivity')
  , _ = require('underscore')
  
describe('Economic Activity', function(){
  
  describe('loadCSV', function(){
    it('should clear database and load 2384 economic activities', function(done){
      EconomicActivity.loadCSV(function(err) {
        should.not.exist(err)       
        EconomicActivity.count({}, function(err,count){
          should.not.exist(err)
          count.should.equal(2383)
          done()
        })
      })
    })
  })

})