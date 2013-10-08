
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
  , States = mongoose.model('States')
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
      .expect(/Coleções de dados/)
      .end(done)
    })
  })
  
  describe('Data Collections', function(){
    context('collections are empty', function(){
      before(function(done){
        EconomicActivity.collection.remove(function(){
          States.collection.remove(done)
        })
      })

      it('should show warning when collections are not loaded', function(done){
        agent
        .get('/admin')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(/não há setores carregados/)
        .expect(/não há estados carregados/)
        .end(done)
      })
    })
    
    it('should import economic activities from CSV', function(done){
      EconomicActivity.loadCSV(function(err){
        should.not.exist(err)
        States.loadCSV(function(err){
          should.not.exist(err)
          agent
          .get('/admin')
          .expect('Content-Type', /html/)
          .expect(200)
          .expect(/2384 setores/)
          .expect(/27 estados/)
          .end(done)
        })        
      })
    })
    
    it('should import state list (IBGE) from csv')  
  })  
})