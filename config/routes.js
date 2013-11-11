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

/**
 * Expose routes
 */

module.exports = function (app, passport) {

  // project routes
  app.get('/projects', projects.index)
  app.get('/projects/:projectId', projects.show)
  app.get('/data/projects.csv', projects.downloadCSV)
 
  app.param('projectId', projects.load)

  // financings routes
  app.get('/financings', financings.index)
  app.get('/financings/:financingId', financings.show)
  app.get('/data/financings.csv', financings.downloadCSV)
  
  app.param('financingId', financings.load)

  // organization routes
  app.get('/organizations', organizations.index)
  app.get('/organizations/:organizationId', organizations.show)
  app.param('organizationId', organizations.load)
    
  // home route
  app.get('/', home.index)

  // admin routes
  app.get('/populate', admin.populate)

}
