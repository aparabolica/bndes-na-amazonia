
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Project = mongoose.model('Project')
  , utils = require('../../lib/utils')
  

/**
 * List
 */

exports.index = function(req, res){
  var options = {
    perPage: 20,
    page: 0
  }
  
  Project.list(options, function(err, projects) {
    if (err) return res.render('500')
    res.render('home/index', {
       projects: projects,
       _ : require('underscore')
    })    
  })

}