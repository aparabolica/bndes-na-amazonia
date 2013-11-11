
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
  res.render('home/index',{title: 'Início'})    
}