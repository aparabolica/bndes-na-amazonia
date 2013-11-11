/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema
  , Activity = mongoose.model('Activity')
  , Financing = mongoose.model('Financing')
  , _ = require('underscore') 
  , csv = require('csv')

/**
 * Organization Schema
 */

var OrganizationSchema = new Schema({
  name: {type : String, default : '', trim : true, required: true},
  legalName: {type : String, default : '', trim : true},
  profile: {type : String, default : '', trim : true},
  activities: [String],
  financings: [{type : Schema.ObjectId, ref : 'Financing'}],
  totalFinanced: {type: Number, default: 0}
})

/**
 * Validations
 */

OrganizationSchema.path('name').validate(function (name) {
  return (name.length >= 3 && name.length <= 80) 
}, 'O nome da organização deve ter entre 3 e 80 caracteres')

/**
 * Methods
 */

OrganizationSchema.methods = {
  updateTotalFinanced: function(){
    var self = this
    // update financings related to this organization
    Financing.find({beneficiary: self}, function(err, financings){
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

OrganizationSchema.statics = {


  load: function (id, done) {
    this
      .findOne({ _id : id })
      .populate({path: 'financings', options: { sort: { 'contractDate': 1 } } })
      .exec(done)
  },
  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .sort(options.sortBy || {'name': 1})
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  },
  importFromCSV: function(filename, callback) {
    var self = this

    csv()
    .from.path(__dirname+filename, { columns: true, delimiter: ',', escape: '"' })
    .to.array(function(data){
      // save each project
      _.each(data, function(row){
        newOrganization = new self({
          name: row['Nome'].trim(),
          profile: row['Perfil'].trim()
        })
        newOrganization.save()
      })
      callback()
    })
    .on('error', function(err){
      callback(err)
    })
  },
  updateAllFinancedTotals: function(){
    this.find({}, function(err, organizations){
      if (err) done(err)
      _.each(organizations, function(organization) {
        organization.updateTotalFinanced()
      })
    })
  }
}

mongoose.model('Organization', OrganizationSchema)