
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Activity = mongoose.model('Activity')
  , States = mongoose.model('States')
  , utils = require('../../lib/utils')
  
  
/**
 * Index - list tasks and app status
 */

exports.index = function(req, res){
  Activity.count(function(err, economicActivitiesCount){
    States.count(function(err, statesCount){
      if (err) res.render(500)
      res.render('admin/index', {
        messages: req.flash('info'),
        economicActivitiesCount: economicActivitiesCount,
        statesCount: statesCount
      })
    })    
  })
}

/**
 * Populate basic data (states, economic sectors, etc)
 */

exports.populate = function(req,res) {
  Activity.loadCSV(function(err){
  	if (err) req.flash('error', 'Erro ao carregar setores de atividade econômica')
  	States.loadCSV(function(err){
  		if (err) req.flash('error', 'Erro ao carregar estados')
      res.redirect('admin')
    })
  })
}