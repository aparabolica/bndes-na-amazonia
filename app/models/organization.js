/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema
  , Activity = mongoose.model('Activity')
  , _ = require('underscore') 

/**
 * Organization Schema
 */

var OrganizationSchema = new Schema({
  name: {type : String, default : '', trim : true, required: true},
  legalName: {type : String, default : '', trim : true},
  profile: {type : String, default : '', trim : true},
  activities: [String],
  projects: [{
    role: {type:String, enum: ['client', 'financer', 'executor'],
    project: {type : Schema.ObjectId, ref : 'Project'}}
  }]
})

/**
 * Validations
 */

OrganizationSchema.path('name').validate(function (name) {
  return (name.length >= 3 && name.length <= 80) 
}, 'O nome da organização deve ter entre 3 e 80 caracteres')

/**
 * Statics
 */

OrganizationSchema.statics = {


  load: function (id, done) {
    this
      .findOne({ _id : id })
      .exec(done)
  },

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .sort('name')
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }

}

mongoose.model('Organization', OrganizationSchema)