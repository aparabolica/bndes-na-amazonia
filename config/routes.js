/*!
 * Module dependencies.
 */

var async = require('async')

/**
 * Controllers
 */

var users = require('../app/controllers/users')
  , home = require('../app/controllers/home')
  , projects = require('../app/controllers/projects')
  , financings = require('../app/controllers/financings')
  , organizations = require('../app/controllers/organizations')
  , admin = require('../app/controllers/admin')
  , populate = require('../app/controllers/populate')
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

  app.param('userId', users.user)

  // project routes
  app.get('/projects', projects.index)
  app.get('/projects/new', auth.requiresLogin, projects.new)
  app.post('/projects', auth.requiresLogin, projects.create)
  app.get('/projects/:projectId', projects.show)
  app.get('/projects/:projectId/edit', projectAuth, projects.edit)
  app.put('/projects/:projectId', projectAuth, projects.update)
  app.del('/projects/:projectId', projectAuth, projects.destroy)
 
  app.param('projectId', projects.load)

  // financings routes
  app.get('/financings', financings.index)
  app.get('/financings/new', auth.requiresLogin, financings.new)
  app.post('/financings', auth.requiresLogin, financings.create)
  app.get('/financings/:financingId', financings.show)
  app.get('/financings/:financingId/edit', auth.requiresLogin, financings.edit)
  app.put('/financings/:financingId', auth.requiresLogin, financings.update)
  app.del('/financings/:financingId',  auth.requiresLogin, financings.destroy)
  app.get('/data/financings.csv', financings.downloadCSV)
  
  app.param('financingId', financings.load)

  // organization routes
  app.get('/organizations', organizations.index)
  app.get('/organizations/new', auth.requiresLogin, organizations.new)
  app.post('/organizations', auth.requiresLogin, organizations.create)
  app.get('/organizations/:organizationId', organizations.show)
  app.get('/organizations/:organizationId/edit', auth.requiresLogin, organizations.edit)
  app.put('/organizations/:organizationId', auth.requiresLogin, organizations.update)
  app.del('/organizations/:organizationId',  auth.requiresLogin, organizations.destroy)
  //  
  app.param('organizationId', organizations.load)
    
  // home route
  app.get('/', home.index)

  // admin routes
  app.get('/admin', admin.index)
  // app.get('/admin/populate', admin.populate)
  app.get('/admin/populate/organizations', populate.organizations)

}
