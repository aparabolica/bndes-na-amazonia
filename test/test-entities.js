
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , should = require('should')
  , request = require('supertest')
  , app = require('../server')
  , context = describe
  , User = mongoose.model('User')
  , Entity = mongoose.model('Entity')
  , agent = request.agent(app)
  
  
describe('Entities', function(){
  before(function (done) {
    User.find().remove();
    // create a user
    var user = new User({
      email: 'foobar@example.com',
      name: 'Foo bar',
      username: 'foobar',
      password: 'foobar'
    })
    user.save()
    done()
  })


  context('DB is empty', function(){
    before(function(done){
      Entity.find().remove();
      Entity.count({}, function(err,count){
        should.not.exist(err);
        count.should.equal(0);
      });
      done();
    })
    it('should show a message and create entity page')
  })

  context('DB is populated', function(){
    it('should show entities at front page')
  })

  describe('GET /entities/new', function () {
    context('When not logged in', function () {
      it('should redirect to /login', function (done) {
        agent
        .get('/entities/new')
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
        .get('/entities/new')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(/New Entity/)
        .end(done)
      })
    })
  })

  describe('POST /entities', function () {
    context('When not logged in', function () {
      it('should redirect to /login', function (done) {
        request(app)
        .get('/entities/new')
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
          Entity.count(function (err, cnt) {
            count = cnt
            done()
          })
        })

        it('should respond with error', function (done) {
          agent
          .post('/entities')
          .field('shortName', '')
          .expect('Content-Type', /html/)
          .expect(200)
          .expect(/Entity short name cannot be blank/)
          .end(done)
        })

        it('should not save to the database', function (done) {
          Entity.count(function (err, cnt) {
            count.should.equal(cnt)
            done()
          })
        })
      })

      describe('Valid parameters', function () {
        before(function (done) {
          Entity.count(function (err, cnt) {
            count = cnt
            done()
          })
        })

        it('should redirect to the new entity page', function (done) {
          agent
          .post('/entities')
          .field('shortName', 'my entity short name')
          .expect('Content-Type', /plain/)
          .expect('Location', /\/entities\//)
          .expect(302)
          .expect(/Moved Temporarily/)
          .end(done)
        })

        it('should insert a record to the database', function (done) {
          Entity.count(function (err, cnt) {
            cnt.should.equal(count + 1)
            done()
          })
        })

        it('should save the entity to the database', function (done) {
          Entity
          .findOne({ shortName: 'my entity short name'})
          .populate('createdByUser')
          .exec(function (err, entity) {
            should.not.exist(err)
            entity.should.be.an.instanceOf(Entity)
            entity.shortName.should.equal('my entity short name')
            entity.createdByUser.email.should.equal('foobar@example.com')
            entity.createdByUser.name.should.equal('Foo bar')
            done()
          })
        })
      })
    })
  })

  after(function (done) {
    require('./helper').clearDb(done)
  })  
  
})