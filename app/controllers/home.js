
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
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
  var perPage = 30
  var options = {
    perPage: perPage,
    page: page
  }

  res.render('home/index', {
    Project: mongoose.model('Project')
  })
}