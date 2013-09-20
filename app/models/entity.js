
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Imager = require('imager')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , imagerConfig = require(config.root + '/config/imager.js')
  , Schema = mongoose.Schema

/**
 * Entity Schema
 */

var EntitySchema = new Schema({
  shortName: {type : String, trim : true},
  createdByUser: {type : Schema.ObjectId, ref : 'User'},
  createdAt: {type : Date, default : Date.now}
})

/**
 * Validations
 */

EntitySchema.path('shortName').validate(function (shortName) {
  return shortName.length > 0
}, 'Entity short name cannot be blank')

/**
 * Statics
 */

EntitySchema.statics = {

  /**
   * Find entity by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user', 'name email username')
      .exec(cb)
  },

  /**
   * List entities
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .populate('user', 'name username')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }

}

mongoose.model('Entity', EntitySchema)