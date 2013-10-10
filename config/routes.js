/*!
 * Module dependencies.
 */

var async = require('async')

/**
 * Controllers
 */

var users = require('../app/controllers/users')
  , projects = require('../app/controllers/projects')
  , entities = require('../app/controllers/entities')
  , admin = require('../app/controllers/admin')
  , auth = require('./middlewares/authorization')

/**
 * Route middlewares
 */

var projectAuth = [auth.requiresLogin]

/**
 * Expose routes
 */

module.exports = function (app, passport) {

  // user routes
  app.get('/login', users.login)
  app.get('/signup', users.signup)
  app.get('/logout', users.logout)
  app.post('/users', users.create)
  app.post('/users/session',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }), users.session)
  app.get('/users/:userId', users.show)
  app.get('/auth/facebook',
    passport.authenticate('facebook', {
      scope: [ 'email', 'user_about_me'],
      failureRedirect: '/login'
    }), users.signin)
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/login'
    }), users.authCallback)
  app.get('/auth/github',
    passport.authenticate('github', {
      failureRedirect: '/login'
    }), users.signin)
  app.get('/auth/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/login'
    }), users.authCallback)
  app.get('/auth/twitter',
    passport.authenticate('twitter', {
      failureRedirect: '/login'
    }), users.signin)
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      failureRedirect: '/login'
    }), users.authCallback)
  app.get('/auth/google',
    passport.authenticate('google', {
      failureRedirect: '/login',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }), users.signin)
  app.get('/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/login'
    }), users.authCallback)
  app.get('/auth/linkedin',
    passport.authenticate('linkedin', {
      failureRedirect: '/login',
      scope: [ 
        'r_emailaddress'
      ]
    }), users.signin)
  app.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', {
      failureRedirect: '/login'
    }), users.authCallback)

  app.param('userId', users.user)

  // prject routes
  app.get('/projects', projects.index)
  app.get('/projects/new', auth.requiresLogin, projects.new)
  app.post('/projects', auth.requiresLogin, projects.create)
  app.get('/projects/:projectId', projects.show)
  app.get('/projects/:projectId/edit', projectAuth, projects.edit)
  app.put('/projects/:projectId', projectAuth, projects.update)
  app.del('/projects/:projectId', projectAuth, projects.destroy)
 
  app.param('projectId', projects.load)
  
  // entity routes
  // app.get('/entities', entities.index)
  // app.get('/entities/new', auth.requiresLogin, entities.new)
  // app.post('/entities', auth.requiresLogin, entities.create)
  // app.get('/entities/:entityId', entities.show)
  // app.get('/entities/:entityId/edit', articleAuth, entities.edit)
  // app.put('/entities/:id', articleAuth, entities.update)
  // app.del('/entities/:id', articleAuth, entities.destroy)
  
  app.param('entityId', entities.load)
  
  // home route
  app.get('/', projects.index)

  // admin routes
  app.get('/admin', admin.index)
  app.get('/admin/populate', admin.populate)

  // tag routes
  var tags = require('../app/controllers/tags')
  app.get('/tags/:tag', tags.index)

}
