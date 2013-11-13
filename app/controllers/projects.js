
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Project = mongoose.model('Project')
  , utils = require('../../lib/utils')
  , _ = require('underscore')
  , csv = require('csv')

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
        title: 'Projetos',
        projects: projects,
        page: page + 1,
        pages: Math.ceil(count / perPage),
        Globalize: require('globalize'),
        accounting: require('accounting')
      })
    })
  })  
}

/**
 * New project
 */

exports.new = function(req, res){
  res.render('projects/new', {
    title: 'Mapear um projeto novo',
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
      req.flash('success', 'Projeto criado com sucesso!')
      return res.redirect('/projects/'+project._id)
    }

    res.render('projects/new', {
      title: 'Mapear um projeto novo',
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
    title: 'Editar projeto',
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
      req.flash('success', 'Projeto atualizado com sucesso!')      
      return res.redirect('/projects/' + project._id)
    }

    res.render('projects/edit', {
      title: project.title,
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
    project: req.project,
    Globalize: require('globalize'),
    Moment: require('moment'),
    accounting: require('accounting'),
    md: require('markdown').markdown
    
  })
}

/**
 * Delete an project
 */

exports.destroy = function(req, res){
  var project = req.project
  project.remove(function(err){
    req.flash('info', 'Removido com sucesso!')
    res.redirect('/projects')
  })
}

/**
 * Download CSV feature
 */

exports.downloadCSV = function(req, res){
  Project.find({})
  .sort('title') 
  .exec(function(err,projects){
    var data = [['título','descrição','número_de_ações','total_financiado']]
    _.each(projects, function(project){
      console.log(project)
      data.push([ 
        project.title,
        project.description,
        project.legalActionsQty,        
        project.totalFinanced        
      ])
    })
    res.setHeader('Content-disposition', 'attachment; filename=projetos.csv');
    res.writeHead(200, {
      'Content-Type': 'text/csv'
    });
    csv()
    .from(data)
    .to(res)    
  })
}