
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Project = mongoose.model('Project')
  , utils = require('../../lib/utils')
  , _ = require('underscore')

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
        pages: Math.ceil(count / perPage)
      })
    })
  })  
}