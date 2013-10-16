/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , should = require('should')
  , mocha = require('mocha')
  , model = require('../../app/models/activity')
  , context = describe
  , Activity = mongoose.model('Activity')
  
describe('Economic Activity', function(){
  describe('loadCSV', function(){
    it('should clear database and load 2384 economic activities', function(done){
      Activity.loadCSV(function(err) {
        should.not.exist(err)       
        Activity.count({}, function(err,count){
          should.not.exist(err)
          count.should.equal(2383)
          done()
        })
      })
    })
  })
})