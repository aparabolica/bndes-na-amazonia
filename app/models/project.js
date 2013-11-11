/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Quiche = require('quiche')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema
  , Organization = mongoose.model('Organization')
  , Financing = mongoose.model('Financing')  
  , _ = require('underscore')
  , csv = require('csv')
  , allStates = ["Acre","Alagoas","Amapá","Amazonas","Bahia","Ceará","Distrito Federal","Espírito Santo","Goiás","Maranhão","Mato Grosso","Mato Grosso do Sul","Minas Gerais","Pará","Paraíba","Paraná","Pernambuco","Piauí","Rio de Janeiro","Rio Grande do Norte","Rio Grande do Sul","Rondônia","Roraima","Santa Catarina","São Paulo","Sergipe","Tocantins"]


/**
 * Project Schema
 */

var ProjectSchema = new Schema({
  title: {type : String, default : '', trim : true},
  description: {type : String, default : '', trim : true},
  financings: [{type : Schema.ObjectId, ref : 'Financing'}],
  totalFinanced: {type: Number, default: 0},
  legalActionsQty: {type: Number, default: 0},
  legalActionsDescription: {type : String, default : '', trim : true},
  states: [{type:String, enum: allStates}],
  createdAt  : {type : Date, default : Date.now}
})

/**
 * Validations
 */

ProjectSchema.path('title').validate(function (title) {
  return (title.length > 5 && title.length <= 200) 
}, 'O título do projeto deve ter entre 5 e 200 caracteres')

ProjectSchema.path('description').validate(function (description) {
  return (description.length > 10 && description.length <= 500) 
}, 'A descrição do projeto deve ter entre 10 e 500 caracteres')

/**
 * Methods
 */

ProjectSchema.methods = {
  updateTotalFinanced: function(){
    var self = this
    // update financings related to this project
    Financing.find({project: self}, function(err, financings){
      if (err) return false
      self.totalFinanced = 0
      _.each(financings, function(financing){
        self.totalFinanced = self.totalFinanced + financing.amount
      })
      self.save()      
    })
  }
}

/**
 * Statics
 */

ProjectSchema.statics = {
  
  load: function (id, done) {
    this
      .findOne({ _id : id })
      .populate({path: 'financings', options: { sort: { 'contractDate': 1 } } })
      .exec(done)
  },
  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .sort({'totalFinanced': -1}) 
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  },
  importFromCSV: function(filename, callback) {
    var self = this
    csv()
    .from.path(__dirname+filename, { columns: true, delimiter: ',', escape: '"' })
    .to.array( function(data){
      // save each project
      _.each(data, function(row){
        newProject = new self({
          title: row['Título'],
          description: row['Descrição'],
          legalActionsQty: row['Quantidade de ações legais'] || 0,
          legalActionsDescription: row['Descrição das ações legais']
        })
        newProject.save()
      })
      callback()
    });
  },
  updateAllFinancedTotals: function(){
    // get all projects
    this.find({}, function(err, projects){
      if (err) done(err)
      // for each
      _.each(projects, function(proj) {
        proj.updateTotalFinanced()
      })
    })
  }
}

mongoose.model('Project', ProjectSchema)