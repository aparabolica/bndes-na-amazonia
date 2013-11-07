/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema
  , _ = require('underscore')
  , Moment = require('moment') 
  , csv = require('csv')

/**
 * Financing Schema
 */

var FinancingSchema = new Schema({
  contractDate: {type:Date},
  isDirect: {type: Boolean, default: true},
  description: {type : String, default : '', trim : true},
  project: {type: Schema.ObjectId, ref: 'Project'},
  beneficiary: {type: Schema.ObjectId, ref: 'Organization'},  
  amount: {type: Number}
})

/**
 * Validations
 */

FinancingSchema.path('isDirect').validate(function (isDirect) {
  return (typeof(isDirect) == "boolean")
}, 'Informe se o financiamento é direto ou indireto.')

// FinancingSchema.path('description').validate(function (description) {
//   return (description.length > 10 && description.length <= 500) 
// }, 'A descrição do financiamento deve ter entre 10 e 500 caracteres')

FinancingSchema.path('amount').validate(function (amount) {
  return ((amount) && amount > 0)
}, 'O montante financiado deve ser um número positivo e maior que zero.')

/**
 * Post-save hook
 */

FinancingSchema.post('save', function () {
  // mongoose.model('Project').updateRelatedFinancings()
  // mongoose.model('Organization').updateRelatedFinancings()  
})

/**
 * Statics
 */

FinancingSchema.statics = {


  load: function (id, done) {
    this.findOne({ _id : id })
      .populate('project', 'title')
      .populate('beneficiary')
      .exec(done)
  },

  list: function (options, cb) {
    var criteria = options.criteria || {}
    this.find(criteria)
      .sort(options.sortBy || 'name') 
      .populate('project')
      .populate('beneficiary')
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  },
  importFromCSV: function(filename, callback) {
    var self = this
    csv()
    .from.path(__dirname+filename, { columns: true, delimiter: ',', escape: '"' })
    .on('record', function(row,index){
      // find executor organization      
      mongoose.model('Organization').findOne({name: row['Beneficiário']}, function(err, beneficiary){
        if (err) callback(err)
        mongoose.model('Project').findOne({title: row['Projeto']}, function(err, project){
          if (err) callback(err)
          record = {
            contractDate: Moment(row['Data'].trim() || '01/01/1900', 'DD/MM/YY'),
            isDirect: row['Tipo'] == 'direto',
            project: project,
            beneficiary: beneficiary,
            amount: row['Valor']
          }
          // save financing
          self.findOneAndUpdate({contractDate:record.contractDate, isDirect: record.isDirect, amount: record.amount },{$set: record}, {upsert: true}, function(err,financing){
            if (err) callback(err)
            financing.save(function(err){
              if (err) callback(err)
            })
          })
        })        
      })
    })
    .on('error', function(err){
      callback(err)
    })
    .on('end', function(){
      callback()
    })
  }
}

mongoose.model('Financing', FinancingSchema)