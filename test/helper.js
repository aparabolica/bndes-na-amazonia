
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , async = require('async')
  , Project = mongoose.model('Project')
  , User = mongoose.model('User')

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
      Project.collection.remove(cb)
    }
  ], done)
}
