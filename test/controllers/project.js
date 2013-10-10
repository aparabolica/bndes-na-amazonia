/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , should = require('should')
  , request = require('supertest')
  , app = require('../../server')
  , context = describe
  , User = mongoose.model('User')
  , Project = mongoose.model('Project')
  , agent = request.agent(app)

 /**
 * Projects tests
 */

describe('Projects controller', function () {
  before(function (done) {
    // create a user
    var user = new User({
      email: 'foobar@example.com',
      name: 'Foo bar',
      username: 'foobar',
      password: 'foobar'
    })
    user.save(done)
  })

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
  
  describe('GET /projects/new', function () {
    context('When not logged in', function () {
      it('should redirect to /login', function (done) {
        agent
        .get('/projects/new')
        .expect('Content-Type', /plain/)
        .expect(302)
        .expect('Location', '/login')
        .expect(/Moved Temporarily/)
        .end(done)
      })
    })

    context('When logged in', function () {
      before(function (done) {
        // login the user
        agent
        .post('/users/session')
        .field('email', 'foobar@example.com')
        .field('password', 'foobar')
        .end(done)
      })

      it('should respond with Content-Type text/html', function (done) {
        agent
        .get('/projects/new')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(/Novo Projeto/)
        .end(done)
      })
    })    
  })

  describe('POST /projects', function () {
    context('When not logged in', function () {
      it('should redirect to /login', function (done) {
        request(app)
        .get('/projects/new')
        .expect('Content-Type', /plain/)
        .expect(302)
        .expect('Location', '/login')
        .expect(/Moved Temporarily/)
        .end(done)
      })
    })
  
    context('When logged in', function () {
      before(function (done) {
        // login the user
        agent
        .post('/users/session')
        .field('email', 'foobar@example.com')
        .field('password', 'foobar')
        .end(done)
      })
  
      describe('Invalid parameters', function () {
        before(function (done) {
          Project.count(function (err, cnt) {
            count = cnt
            done()
          })
        })
  
        it('should respond with error', function (done) {
          agent
          .post('/projects')
          .field('title', '')
          .field('body', 'foo')
          .expect('Content-Type', /html/)
          .expect(200)
          .expect(/Project title cannot be blank/)
          .end(done)
        })
  
        it('should not save to the database', function (done) {
          Project.count(function (err, cnt) {
            count.should.equal(cnt)
            done()
          })
        })
      })
  
      describe('Valid parameters', function () {
        before(function (done) {
          Project.count(function (err, cnt) {
            count = cnt
            done()
          })
        })
  
        it('should redirect to the new article page', function (done) {
          agent
          .post('/articles')
          .field('title', 'foo')
          .field('body', 'bar')
          .expect('Content-Type', /plain/)
          .expect('Location', /\/articles\//)
          .expect(302)
          .expect(/Moved Temporarily/)
          .end(done)
        })
  
        it('should insert a record to the database', function (done) {
          Project.count(function (err, cnt) {
            cnt.should.equal(count + 1)
            done()
          })
        })
  
        it('should save the article to the database', function (done) {
          Project
          .findOne({ title: 'foo'})
          .populate('user')
          .exec(function (err, article) {
            should.not.exist(err)
            article.should.be.an.instanceOf(Project)
            article.title.should.equal('foo')
            article.body.should.equal('bar')
            article.user.email.should.equal('foobar@example.com')
            article.user.name.should.equal('Foo bar')
            done()
          })
        })
      })
    })
  })
   
  after(function (done) {
    require('./../helper').clearDb(done)
  })
})