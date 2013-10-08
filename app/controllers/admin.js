
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , EconomicActivity = mongoose.model('EconomicActivity')
  , utils = require('../../lib/utils')
  
  
/**
 * Index - list tasks and app status
 */



exports.index = function(req, res){
  EconomicActivity.count(function(err, economicActivitiesCount){
    if (err) res.render(500)
    res.render('admin/index', {
      messages: req.flash('info'),
      economicActivitiesCount: economicActivitiesCount
    })    
  })
}

exports.populate = function(req,res) {
  
}