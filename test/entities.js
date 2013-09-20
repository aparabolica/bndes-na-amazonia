
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , should = require('should')
  , request = require('supertest')
  , app = require('../server')
  , context = describe
  , User = mongoose.model('User')
  , Article = mongoose.model('Entity')
  , agent = request.agent(app)
  
  
describe('Entities', function(){
  context('DB is empty', function(){
    it('should show a message and create entity page')
  })
  
  context('DB is populated', function(){
    decribe('GET /', function(){
      it('show front page, with list of entities, by category')
    })
  })
  
})
  
  
