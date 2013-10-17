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
    User.collection.remove(function(){
      // create a user
      var user = new User({
        email: 'foobar@example.com',
        name: 'Foo bar',
        username: 'foobar',
        password: 'foobar'
      })
      user.save(done)      
    })
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
  
        it('should respond with error if empty values', function (done) {
          agent
          .post('/projects')
          .field('title', '')
          .field('description', '')
          .field('state', 'dsdsa')
          .expect('Content-Type', /html/)
          .expect(200)
          .expect(/O título do projeto deve ter entre 5 e 80 caracteres/)
          .expect(/A descrição do projeto deve ter entre 10 e 500 caracteres/)
          .expect(/Selecione ao menos um estado./)
          .end(done)
        })

        it('should respond with error if invalid properties', function (done) {
          agent
          .post('/projects')
          .field('title', new Array(82).join('b'))
          .field('description', new Array(502).join('a'))
          .field('state', 'dsdsa')
          .expect('Content-Type', /html/)
          .expect(200)
          .expect(/O título do projeto deve ter entre 5 e 80 caracteres/)
          .expect(/A descrição do projeto deve ter entre 10 e 500 caracteres/)
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
  
        it('should redirect to the new project page', function (done) {
          agent
          .post('/projects')
          .field('title', 'Nulla laoreet augue ultricies')
          .field('description', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec urna urna, imperdiet sed nunc vel, pharetra dapibus est. Ut purus libero, suscipit quis commodo quis, venenatis eget libero.')
          .field('states','[\'Pará\',\'São Paulo\']')
          .expect('Content-Type', /plain/)
          .expect('Location', /\/projects\//)
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
  
        it('should save the project to the database', function (done) {
          Project
          .findOne({ title: 'Nulla laoreet augue ultricies'})
          .exec(function (err, project) {
            should.not.exist(err)
            project.should.be.an.instanceOf(Project)
            project.title.should.equal('Nulla laoreet augue ultricies')
            project.description.should.equal('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec urna urna, imperdiet sed nunc vel, pharetra dapibus est. Ut purus libero, suscipit quis commodo quis, venenatis eget libero.')
            project.states[0].should.include('Pará')
            project.states[0].should.include('São Paulo')            
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