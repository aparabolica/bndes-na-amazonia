
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Project = mongoose.model('Project')
  , utils = require('../../lib/utils')

/**
 * Home
 */

exports.index = function(req, res){
  res.render('home/index',{title: 'Início'})    
}

/**
 * About
 */

exports.about = function(req, res){
  res.render('home/about')    
}