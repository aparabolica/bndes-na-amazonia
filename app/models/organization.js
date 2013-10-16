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
  title: {type : String, default : '', trim : true},
  profile: {type : String, default : '', trim : true},
  activities: [{type: Schema.ObjectId, ref: 'Activity'}],
  projects: [{
    role: {type:String, enum: ['client', 'financer', 'executor'],
    project: {type : Schema.ObjectId, ref : 'Project'}}
  }]
})

/**
 * Validations
 */

OrganizationSchema.path('title').validate(function (title) {
  return (title.length > 10 && title.length <= 80) 
}, 'O título do financiamento deve ter entre 10 e 80 caracteres')

OrganizationSchema.path('profile').validate(function (profile) {
  return (profile.length > 10 && profile.length <= 500) 
}, 'O perfil da organização deve ter entre 10 e 500 caracteres')

OrganizationSchema.path('activities').validate(function (activities) {
  return (profile.length > 10 && profile.length <= 500) 
}, 'Selecione ao menos uma atividade exercida pela organização.')

/**
 * Statics
 */

OrganizationSchema.statics = {


  load: function (id, done) {
    this.findOne({ _id : id })
      .populate('projects')
      .exec(done)
  },

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .sort('title') 
      .populate('projects')
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }

}

mongoose.model('Organization', OrganizationSchema)