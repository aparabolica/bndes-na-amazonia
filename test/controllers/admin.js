
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , should = require('should')
  , request = require('supertest')
  , app = require('../../server')
  , context = describe
  , User = mongoose.model('User')
  , EconomicActivity = mongoose.model('EconomicActivity')
  , agent = request.agent(app)
  
/**
 * Admin controller tests.
 */

describe('Admin controller', function(){
  // before(function (done) {
  //   User.collection.remove(function(err){
  //     if (!err) {
  //       // create a user
  //       var user = new User({
  //         email: 'foobar@example.com',
  //         name: 'Foo bar',
  //         username: 'foobar',
  //         password: 'foobar'
  //       })
  //       user.save(done)
  //     } else {
  //       done(err)
  //     }
  //   })
  // })
  
  describe('GET /admin',function(){
    it('should list admin tasks', function(done){
      agent
      .get('/admin')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(/Data collections/)
      .end(done)
    })
  })
  
  describe('Data Collections', function(){
    before(function(done){
      // Clear CNAE Classes
      EconomicActivity.collection.remove(done)
    })
    
    it('should show Cities and CNAE Classes collections as empty', function(done){
      agent
      .get('/admin')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(/Empty/)
      .end(done)
    })
    
    it('should import economic activities from CSV', function(done){
      EconomicActivity.loadCSV(function(err){
        if (!err) {
          agent
          .get('/admin')
          .expect('Content-Type', /html/)
          .expect(200)
          .expect(/2384 activities loaded/)
          .end(done)
        }
      })
    })
    
    it('should import city list (IBGE) from csv')  
  })  
})