
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Entity = mongoose.model('Entity')
  , utils = require('../../lib/utils')
  , _ = require('underscore')

/**
 * Load
 */

exports.load = function(req, res, next, id){

  Entity.load(id, function (err, entity) {
    if (err) return next(err)
    if (!entity) return next(new Error('not found'))
    req.entity = entity
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

  Entity.list(options, function(err, entities) {
    if (err) return res.render('500')
    Entity.count().exec(function (err, count) {
      res.render('entities/index', {
        title: 'Entities',
        entities: entities,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      })
    })
  })  
}
  
  
/**
 * New entity
 */

exports.new = function(req, res){
  res.render('entities/new', {
    title: 'New Entity',
    entity: new Entity({})
  })
}

/**
 * Create an entity
 */

exports.create = function (req, res) {
  var entity = new Entity(req.body)
  entity.user = req.user

  entity.save( function (err) {
    if (!err) {
      req.flash('success', 'Successfully created entity!')
      return res.redirect('/entities/'+entity._id)
    }

    res.render('entity/new', {
      title: 'New entity',
      entity: entity,
      errors: utils.errors(err.errors || err)
    })
  })
}

/**
 * Show
 */

exports.show = function(req, res){
  res.render('entities/show', {
    title: req.entity.name,
    entity: req.entity
  })
}

/**
 * Edit an entity
 */

exports.edit = function (req, res) {
  res.render('entities/edit', {
    title: 'Edit ' + req.entity.name,
    entity: req.entity
  })
}
