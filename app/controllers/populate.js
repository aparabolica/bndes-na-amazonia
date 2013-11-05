/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Organization = mongoose.model('Organization')    
  , csv      = require('csv')
  , utils = require('../../lib/utils')
  
  
/**
 * Index - list tasks and app status
 */

exports.organizations = function(req, res){
  // clear organization collection
  Organization.collection.remove(function(err){
    if (err) res.render(500)
    // read data/organization.csv
    csv()
    .from.path(__dirname+'/../../data/organizations.csv', { columns: true, delimiter: ';', escape: '"' })
    .on('record', function(row,index){
      record = {
        _id: JSON.parse(row._id)['$oid'],
        name: row.name,
        legalName: row.legalName,        
        profile: row.profile
      }
      Organization.findOneAndUpdate({_id: record._id},{$set: record}, {upsert: true}, function(err,org){
        if (err) console.log(err)
      })      
    })
    .on('error', function(error){
      res.render(500)
    })
    .on('end', function(){    
      res.redirect('admin')
    })
  })
  
}