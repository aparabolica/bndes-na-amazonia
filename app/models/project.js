/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Quiche = require('quiche')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema
  , Financing = mongoose.model('Financing')  
  , _ = require('underscore')
  , allStates = ["Acre","Alagoas","Amapá","Amazonas","Bahia","Ceará","Distrito Federal","Espírito Santo","Goiás","Maranhão","Mato Grosso","Mato Grosso do Sul","Minas Gerais","Pará","Paraíba","Paraná","Pernambuco","Piauí","Rio de Janeiro","Rio Grande do Norte","Rio Grande do Sul","Rondônia","Roraima","Santa Catarina","São Paulo","Sergipe","Tocantins"]


/**
 * Project Schema
 */

var ProjectSchema = new Schema({
  title: {type : String, default : '', trim : true},
  description: {type : String, default : '', trim : true},
  financings: [{type : Schema.ObjectId, ref : 'Financing'}],
  financingTotal: {type: Number, default: 0},
  states: [{type:String, enum: allStates}],
  createdAt  : {type : Date, default : Date.now}
})

/**
 * Validations
 */

ProjectSchema.path('title').validate(function (title) {
  return (title.length > 5 && title.length <= 80) 
}, 'O título do projeto deve ter entre 5 e 80 caracteres')

ProjectSchema.path('description').validate(function (description) {
  return (description.length > 10 && description.length <= 500) 
}, 'A descrição do projeto deve ter entre 10 e 500 caracteres')

/**
 * Methods
 */

ProjectSchema.methods = {
  
  chartImageUrl: function() {
    var self = this
      , pie = new Quiche('pie');
    pie.setTransparentBackground()
    _.each(self.financings, function(financing){
      financing
      pie.addData(financing.amount, financing.title, 'FF0000');      
    })
    return pie.getUrl(true)
  }

}

/**
 * Statics
 */

ProjectSchema.statics = {


  load: function (id, done) {
    this
      .findOne({ _id : id })
      .populate('financings')
      .exec(done)
  },

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .sort({'financingTotal': -1}) 
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  },
  updateRelatedFinancings: function(){
    // get all projects
    this.find({}, function(err, projects){
      if (err) done(err)
      // for each
      _.each(projects, function(project) {
        // update financings related to this project
        Financing.find({project: project}, function(err, financings){
          if (err) return false
          project.financings = financings
          project.financingTotal = 0
          _.each(financings, function(financing){
            project.financingTotal = project.financingTotal + financing.amount
          })
          project.save()
        })
      })
    })
  },
  asArrayDataTable: function() {
    // get all projects
    this.find({}, function(err, projects){
      if (err) done(err)
      var arrayDataTable = []
      // for each
      _.each(projects, function(project) {
        arrayDataTable << [project.name, project.financingTotal]
      })
      return arrayDataTable
    })
    
  }
}

mongoose.model('Project', ProjectSchema)