/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema
  , _ = require('underscore')

/**
 * Financing Schema
 */

var FinancingSchema = new Schema({
  title: {type : String, default : '', trim : true},
  description: {type : String, default : '', trim : true},
  project: {type : Schema.ObjectId, ref : 'Project'},
  amount: Number,
  contractDate: Date
})

/**
 * Validations
 */

FinancingSchema.path('title').validate(function (title) {
  return (title.length > 10 && title.length <= 80) 
}, 'O título do financiamento deve ter entre 10 e 80 caracteres')

FinancingSchema.path('description').validate(function (description) {
  return (description.length > 10 && description.length <= 500) 
}, 'A descrição do financiamento deve ter entre 10 e 500 caracteres')

FinancingSchema.path('amount').validate(function (amount) {
  return ((amount) && amount > 0)
}, 'O montante financiado deve ser um número positivo e maior que zero.')

/**
 * Post-save hook
 */

FinancingSchema.post('save', function (next) {
  Project.findOne(this.project).exec(function(err,proj){
    proj.updateFinancing(next)
  })
})

/**
 * Statics
 */

FinancingSchema.statics = {


  load: function (id, done) {
    this.findOne({ _id : id })
      .populate('project', 'title')
      .exec(done)
  },

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .sort('title') 
      .populate('project')
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }

}

mongoose.model('Financing', FinancingSchema)