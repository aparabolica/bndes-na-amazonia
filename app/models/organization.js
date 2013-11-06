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
    .on('record', function(row,index){
      orgName = row['Nome'].trim()
      orgProfile = row['Perfil'].trim()
      self.findOneAndUpdate({name: orgName},{$set: { name: orgName, profile: orgProfile }}, {upsert: true}, function(err,org){
        if (err) callback(err)
        org.save(function(err){
          if (err) callback(err)
        }) 
      })
    })
    .on('error', function(err){
      callback(err)
    })
    .on('end', function(){
      callback()
    })
  },
  updateRelatedFinancings: function(){
    // get all organizations
    this.find({}, function(err, organizations){
      if (err) done(err)
      // for each
      _.each(organizations, function(organization) {
        // update financings related to this organizations
        Financing.find({beneficiary: organization}, function(err, financings){
          if (err) return false
          organization.financings = financings
          organization.totalFinanced = 0
          _.each(financings, function(financing){
            organization.totalFinanced = organization.totalFinanced + financing.amount
          })
          organization.save()
        })
      })
    })
  }

}

mongoose.model('Organization', OrganizationSchema)