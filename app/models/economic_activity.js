/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , csv      = require('csv')
  , Schema = mongoose.Schema

/**
 * Economic Activity schema.
 */

var EconomicActivitySchema = new Schema({
 id: { type: String, default: '' },
 level: { type: String, default: '' },
 description: { type: String, default: '' }
})

/**
 * Statics
 */
 
EconomicActivitySchema.statics = {

 loadCSV: function(done) {
    this.collection.remove(function(err){
      csv()
      .from.path(__dirname+'/../../data/cnae/economic_activities.csv', { columns: true, delimiter: ',', escape: '"' })
      .on('record', function(row,index){
       mongoose.model('EconomicActivity', EconomicActivitySchema)({
         id:          row.id,
         uf:          row.level,
         description: row.description
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

mongoose.model('EconomicActivity', EconomicActivitySchema)