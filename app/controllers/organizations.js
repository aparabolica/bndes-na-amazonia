/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Organization = mongoose.model('Organization')
  , Project = mongoose.model('Project')
  , Activity = mongoose.model('Activity')
  , utils = require('../../lib/utils')
  , _ = require('underscore')

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
  Activity.find({level: 'Subclasse'}, function(err, activities) {
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
      req.flash('success', 'Organização criada com sucesso!')
      return res.redirect('/organizations/'+organization._id)
    }
        
    Activity.find({level: 'Subclasse'}, function(err, activities) {
      if (error) return res.render('500')
      Project.list({}, function(projerr, projects) {
        if (projerr) return res.render('500')    
        res.render('organizations/new', {
          title: 'Mapear uma nova organização',
          organization: organization,
          activities: activities,
          projects: projects,
          errors: utils.errors(err.errors || projerr || error)
        })
      })
    })
  })
}

/**
 * Edit an organization
 */

exports.edit = function (req, res) {
  Activity.find({level: 'Subclasse'}, function(err, activities) {
    if (err) return res.render('500')
    res.render('organizations/edit', {
      title: 'Alterar ' + req.organization.name,
      organization: req.organization,
      activities: activities
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

  Activity.find({level: 'Subclasse'}, function(err, activities) {
      if (error) return res.render('500')
      res.render('organizations/edit', {
        title: 'Alterar ' + req.organization.title,
        activities: activities,
        organization: organization,
        errors: err.errors
      })
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