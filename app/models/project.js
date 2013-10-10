/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema

/**
 * Project Schema
 */

var ProjectSchema = new Schema({
  title: {type : String, default : '', trim : true},
  officialName: {type : String, default : '', trim : true},
  description: {type : String, default : '', trim : true},
  contractDate: Date,
  contractValue: Number,
  influencedStates: [String],
  createdAt  : {type : Date, default : Date.now}
})

/**
 * Validations
 */

ProjectSchema.path('title').validate(function (title) {
  return (title.length > 10 && title.length <= 80) 
}, 'O título do projeto deve ter entre 10 e 80 caracteres')

ProjectSchema.path('description').validate(function (description) {
  return (description.length > 10 && description.length <= 500) 
}, 'A descrição do projeto deve ter entre 10 e 500 caracteres')

/**
 * Statics
 */

ProjectSchema.statics = {


  load: function (id, done) {
    this.findOne({ _id : id })
      .exec(done)
  },

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }

}


mongoose.model('Project', ProjectSchema)