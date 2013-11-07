
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Activity = mongoose.model('Activity')
  , Financing = mongoose.model('Financing')
  , Project = mongoose.model('Project')
  , Organization = mongoose.model('Organization')    
  , States = mongoose.model('States')
  , csv      = require('csv')
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
  // Remove current data
  Financing.collection.remove(function(err){
    if (err) res.render(500) 
    Project.collection.remove(function(err){
      if (err) res.render(500) 
      Organization.collection.remove(function(err){
        if (err) res.render(500)
        // import organizations 
        Organization.importFromCSV('/../../data/organizations.csv', function(err){
          if (err) res.render(500)
          Project.importFromCSV('/../../data/projects.csv', function(err){
            if (err) res.render(500)
            Financing.importFromCSV('/../../data/financings.csv', function(err){
              if (err) res.render(500)
              Project.updateRelatedFinancings()
              //Organization.updateRelatedFinancings()                
            })            
          })
        })
      })
      res.redirect('admin')
    })
  })
}