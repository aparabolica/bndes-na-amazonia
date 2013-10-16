/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Organization = mongoose.model('Organization')
  , Activity = mongoose.model('Activity')
  , utils = require('../../lib/utils')

/**
 * Load
 */

exports.load = function(req, res, next, id){
  Organization.load(id, function (err, organization) {
    if (err) return next(err)
    if (!organization) return next(new Error('not found'))
    req.organization = organization
    next()
  })
}

/**
 * List
 */

exports.index = function(req, res){
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
  var perPage = 30
  var options = {
    perPage: perPage,
    page: page
  }

  Organization.list(options, function(err, organizations) {
    if (err) return res.render('500')
    Organization.count().exec(function (err, count) {
      res.render('organizations/index', {
        organizations: organizations,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      })
    })
  })  
}


/**
 * New organization
 */

exports.new = function(req, res){
  Activity.find({}, function(err, activities) {
    if (err) return res.render('500')
    res.render('organizations/new', {
        title: 'Mapear uma nova organização',
      organization: new Organization({}),
      activities: activities
    })
  })
}

/**
 * Create an organization
 */

exports.create = function (req, res) {
  var organization = new Organization(req.body)
  organization.save(function (err) {
    if (!err) {
      req.flash('success', 'Successfully created organization!')
      return res.redirect('/organizations/'+organization._id)
    }
    Project.list({}, function(projerr, projects) {
      if (projerr) return res.render('500')    
      res.render('organizations/new', {
        title: 'Mapear uma nova organização',
        organization: organization,
        projects: projects,
        errors: utils.errors(err.errors || err)
      })
    })
  })
}

/**
 * Edit an organization
 */

exports.edit = function (req, res) {
  Project.list({}, function(err, projects) {
    if (err) return res.render('500')  
    console.log(req.organization)
    res.render('organizations/edit', {
      title: 'Alterar ' + req.organization.title,
      organization: req.organization,
      projects: projects
    })
  })
}

/**
 * Update organization
 */

exports.update = function(req, res){
  var organization = req.organization
  organization = _.extend(organization, req.body)

  organization.save(function(err) {
    if (!err) {
      return res.redirect('/organizations/' + organization._id)
    }

    res.render('organizations/edit', {
      title: 'Alterar ' + req.organization.title,
      organization: organization,
      errors: err.errors
    })
  })
}

/**
 * Show
 */

exports.show = function(req, res){
  res.render('organizations/show', {
    title: req.organization.title,
    organization: req.organization
  })
}

/**
 * Delete an organization
 */

exports.destroy = function(req, res){
  var organization = req.organization
  organization.remove(function(err){
    req.flash('info', 'Removido com sucesso')
    res.redirect('/organizations')
  })
}