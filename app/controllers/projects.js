
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Project = mongoose.model('Project')
  , Quiche = require('quiche')  
  , utils = require('../../lib/utils')
  , _ = require('underscore')

/**
 * Load
 */

exports.load = function(req, res, next, id){
  // var User = mongoose.model('User')

  Project.load(id, function (err, project) {
    if (err) return next(err)
    if (!project) return next(new Error('not found'))
    req.project = project
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

  Project.list(options, function(err, projects) {
    if (err) return res.render('500')    
    Project.count().exec(function (err, count) {
      res.render('projects/index', {
        title: 'projects',
        projects: projects,
        page: page + 1,
        pages: Math.ceil(count / perPage),
        Quiche: Quiche
      })
    })
  })  
}

/**
 * New project
 */

exports.new = function(req, res){
  res.render('projects/new', {
    title: 'Novo Projeto',
    project: new Project({})
  })
}

/**
 * Create an project
 */

exports.create = function (req, res) {
  var project = new Project(req.body)
  project.save(function (err) {
    if (!err) {
      req.flash('success', 'Successfully created project!')
      return res.redirect('/projects/'+project._id)
    }

    res.render('projects/new', {
      title: 'New Project',
      project: project,
      errors: utils.errors(err.errors || err)
    })
  })
}

/**
 * Edit an project
 */

exports.edit = function (req, res) {
  res.render('projects/edit', {
    title: 'Edit ' + req.project.title,
    project: req.project
  })
}

/**
 * Update project
 */

exports.update = function(req, res){
  var project = req.project
  project = _.extend(project, req.body)

  project.save(function(err) {
    if (!err) {
      return res.redirect('/projects/' + project._id)
    }

    res.render('projects/edit', {
      title: 'Edit Project',
      project: project,
      errors: err.errors
    })
  })
}

/**
 * Show
 */

exports.show = function(req, res){
  res.render('projects/show', {
    title: req.project.title,
    project: req.project
  })
}

/**
 * Delete an project
 */

exports.destroy = function(req, res){
  var project = req.project
  project.remove(function(err){
    req.flash('info', 'Deleted successfully')
    res.redirect('/projects')
  })
}