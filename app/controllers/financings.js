
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Organization = mongoose.model('Organization')
  , Financing = mongoose.model('Financing')
  , Project = mongoose.model('Project')
  , utils = require('../../lib/utils')
  , _ = require('underscore')
  , Moment = require('moment')
  , Globalize = require('globalize')
  
/**
 * Load
 */

exports.load = function(req, res, next, id){
  Financing.load(id, function (err, financing) {
    if (err) return next(err)
    if (!financing) return next(new Error('not found'))
    req.financing = financing
    next()
  })
}

/**
 * List
 */

exports.index = function(req, res){
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
  var perPage = 30
  var options = {
    sortBy: {'amount': -1},
    perPage: perPage,
    page: page
  }

  Financing.list(options, function(err, financings) {
    if (err) return res.render('500')
    Financing.count().exec(function (err, count) {
      res.render('financings/index', {
        financings: financings,
        page: page + 1,
        pages: Math.ceil(count / perPage),
        Moment: Moment,
        Globalize: Globalize,
        accounting: require('accounting')
      })
    })
  })  
}


/**
 * New financing
 */

exports.new = function(req, res){
  Project.list({}, function(prjErr, projects) {
    if (prjErr) return res.render('500')
    Organization.list({sortBy: 'name'}, function(orgErr, organizations) {
      if (orgErr) return res.render('500')
      res.render('financings/new', {
        title: 'Mapear um novo financiamento',
        financing: new Financing({}),
        projects: projects,
        organizations: organizations
      })
    })
  })
}

/**
 * Create an financing
 */

exports.create = function (req, res) {
  var financing = new Financing(req.body)
  financing.save(function (err) {
    if (!err) {
      req.flash('success', 'Financiamento criado com sucesso!')
      return res.redirect('/financings/'+financing._id)
    }
    Project.list({}, function(projerr, projects) {
      if (projerr) return res.render('500')    
      Organization.list({sortBy: 'name'}, function(orgErr, organizations) {
        if (orgErr) return res.render('500')
        res.render('financings/new', {
          title: 'Mapear um novo financiamento',
          financing: financing,
          projects: projects,
          errors: utils.errors(err.errors || err)
        })
      })
    })
  })
}

/**
 * Edit an financing
 */

exports.edit = function (req, res) {
  Project.list({}, function(err, projects) {
    if (err) return res.render('500')
    Organization.list({sortBy: 'name'}, function(orgErr, organizations) {
      if (orgErr) return res.render('500')
      res.render('financings/edit', {
        title: 'Alterar financiamento',
        financing: req.financing,
        projects: projects,
        organizations: organizations
      })
    })
  })
}

/**
 * Update financing
 */

exports.update = function(req, res){
  var financing = req.financing
  financing = _.extend(financing, req.body)

  financing.save(function(err) {
    if (!err) {
      return res.redirect('/financings/' + financing._id)
    }

    res.render('financings/edit', {
      title: 'Edit Financing',
      financing: financing,
      errors: err.errors
    })
  })
}

/**
 * Show
 */

exports.show = function(req, res){
  res.render('financings/show', {
    title: req.financing.title,
    financing: req.financing,
    Moment: require('moment'),
    Globalize: require('globalize'),
    accounting: require('accounting')
  })
}

/**
 * Delete an financing
 */

exports.destroy = function(req, res){
  var financing = req.financing
  financing.remove(function(err){
    req.flash('info', 'Deleted successfully')
    res.redirect('/financings')
  })
}