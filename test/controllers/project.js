/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , should = require('should')
  , request = require('supertest')
  , app = require('../../server')
  , context = describe
  , User = mongoose.model('User')
  , Article = mongoose.model('Project')
  , agent = request.agent(app)

 /**
 * Projects tests
 */

describe('Projects', function () {

  describe('GET /projects', function () {
    it('should respond with Content-Type text/html', function (done) {
      agent
      .get('/projects')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(/Projetos/)
      .end(done)
    })
  })

 after(function (done) {
    require('./../helper').clearDb(done)
  })
})