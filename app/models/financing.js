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
  contractDate: {type:Date, required: true},
  isDirect: {type: Boolean, default: true, required: true},
  description: {type : String, default : '', required: true, trim : true},
  project: {type: Schema.ObjectId, ref: 'Project', required: true},
  amount: {type: Number, required: true}
})

/**
 * Validations
 */

FinancingSchema.path('isDirect').validate(function (isDirect) {
  return (typeof(isDirect) == "boolean")
}, 'Informe se o financiamento é direto ou indireto.')

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
  
  mongoose.model('Project')
    .findOne(this.project)
    .exec(function(err,proj){
      console.log(proj)
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
      .sort('amount') 
      .populate('project')
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }

}

mongoose.model('Financing', FinancingSchema)