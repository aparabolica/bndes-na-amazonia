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
  , async = require('async')

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

FinancingSchema.path('amount').validate(function (amount) {
  return ((amount) && amount > 0)
}, 'O montante financiado deve ser um número positivo e maior que zero.')

/**
 * Post-save hook
 */

FinancingSchema.post('save', function () {
  var self = this
  mongoose.model('Project').findOne({_id: this.project})
    .exec(function(err, project){
      project.financings.addToSet(self)
      project.save()      
  })
  mongoose.model('Organization').findOne(this.beneficiary)
    .exec(function(err, beneficiary){
      beneficiary.financings.addToSet(self)
      beneficiary.save()      
  })
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
  importFromCSV: function(filename, doneImporting) {
    var self = this
      , Project = mongoose.model('Project')
      , Organization = mongoose.model('Organization')
    
    csv()
    .from.path(__dirname+filename, { columns: true, delimiter: ',', escape: '"' })
    .to.array(function(data){
      async.eachSeries(data, function(row, doneSavingAFinancing){
        mongoose.model('Organization').findOne({name: row['Beneficiário']}, function(err, beneficiary){
          if (err) doneSavingAFinancing(err)
          mongoose.model('Project').findOne({title: row['Projeto']}, function(err, project){
            if (err) doneSavingAFinancing(err)
            new self({
              contractDate: Moment(row['Data'].trim() || '01/01/1900', 'DD/MM/YY'),
              isDirect: row['Tipo'] == 'direto',
              project: project,
              beneficiary: beneficiary,
              amount: row['Valor']
            }).save(doneSavingAFinancing)
          })          
        })
      }, function(err){
        Project.updateAllFinancedTotals()
        Organization.updateAllFinancedTotals()
        doneImporting()
      })
    })
    .on('error', function(err){
      callback(err)
    })

  }
}

mongoose.model('Financing', FinancingSchema)