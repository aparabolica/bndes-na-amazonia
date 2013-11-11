
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
  , async = require('async')
  
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
  async.parallel([
    function(callback){
      Financing.collection.remove(callback)
    },
    function(callback){
      Project.collection.remove(callback)
    },
    function(callback){
      Organization.collection.remove(callback)            
    }
  ],
  // After that
  function(err, results){
    if (err) res.render(500)

    // Import organizations and projects
    async.parallel([
      function(callback){
        Organization.importFromCSV('/../../data/organizations.csv', callback)
      },
      function(callback){
         Project.importFromCSV('/../../data/projects.csv', callback)
      }
    ],

    // Then import financings
    function(err, results){
      if (err) res.render(500)      
      Financing.importFromCSV('/../../data/financings.csv', function(err){
        if (err) res.render(500)
        res.render('home/index')
      })
    })
  })
}