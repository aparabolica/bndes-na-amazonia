
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , async = require('async')
  , Article = mongoose.model('Article')
  , User = mongoose.model('User')
  , Entity = mongoose.model('Entity')

/**
 * Clear database
 *
 * @param {Function} done
 * @api public
 */

exports.clearDb = function (done) {
  async.parallel([
    function (cb) {
      User.collection.remove(cb)
    },
    function (cb) {
      Article.collection.remove(cb)
    },
    function (cb) {
      Entity.collection.remove(cb)
    }
  ], done)
}
