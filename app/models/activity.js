/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , csv      = require('csv')
  , _        = require('underscore')
  , Schema = mongoose.Schema

/**
 * Economic Activity schema.
 */

var ActivitySchema = new Schema({
  cnae_id: { type: String, default: '' },
  level: { type: String, enum: ['Seção', 'Divisão', 'Grupo', 'Classe', 'Subclasse'] },
  parent: { type: Schema.ObjectId, ref: 'Activity'},
  children: [{ type: Schema.ObjectId, ref: 'Activity'}],
  description: { type: String, default: '' }
})

/**
 * Statics
 */
 
ActivitySchema.statics = {
  loadCSV: function(done) {
    var Activity = this.model('Activity')
    this.collection.remove(function(err){
      csv()
      .from.path(__dirname+'/../../data/cnae/economic_activities.csv', { columns: true, delimiter: ',', escape: '"' })
      .on('record', function(row,index){
       mongoose.model('Activity', ActivitySchema)({
         cnae_id:     row.id,
         level:       row.level,
         description: row.description
       }).save();
      })
      .on('end', function(){
        Activity.find({}, function(err,activities){
          _.each(activities, function(activity){
            activity.updateHierarchyRefs()
            activity.save()
          })
        })
        done()
      })
      .on('error', function(error){
        done(error)
      })
    })
  }
}

/**
 * Methods
 */

ActivitySchema.methods = {

  parentCnaeId: function(){
    switch(this.level)
    {
    case 'Seção':
      return null
    case 'Divisão':
      return this.cnae_id.substring(0,1)
    case 'Grupo':
      return this.cnae_id.substring(0,6)
    case 'Classe':
      return this.cnae_id.substring(0,4)
    case 'Subclasse':
      return this.cnae_id.substring(0,9)
    }
  },
  
  updateHierarchyRefs: function(){
    this.model('Activity').findOne({cnae_id: this.parentCnaeId()}, function(err,parent){
      if (err) done(err)
      this.parent = parent
    })
  }
  
}

mongoose.model('Activity', ActivitySchema)