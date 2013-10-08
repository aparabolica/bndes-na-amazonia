/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , csv      = require('csv')
  , Schema = mongoose.Schema

/**
 * States schema.
 */

var StatesSchema = new Schema({
 abbreviation: { type: String, default: '' },
 name: { type: String, default: '' },
 region: { type: String, default: '' }
})

/**
 * Statics
 */
 
StatesSchema.statics = {

 loadCSV: function(done) {
    this.collection.remove(function(err){
      csv()
      .from.path(__dirname+'/../../data/br-states.csv', { columns: true, delimiter: ',', escape: '"' })
      .on('record', function(row,index){
       mongoose.model('States', StatesSchema)({
         abbreviation: row.abbreviation,
         name:         row.name,
         region:       row.region
       }).save();
      })
      .on('end', function(){
       done()
      })
      .on('error', function(error){
       done(error)
      })
    })
  }
}

mongoose.model('States', StatesSchema)