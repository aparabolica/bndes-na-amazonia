
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Activity = mongoose.model('Activity')
  , Financing = mongoose.model('Financing')
  , Project = mongoose.model('Project')
  , Organization = mongoose.model('Organization')    
  , States = mongoose.model('States')
  , csv      = require('csv')
  , utils = require('../../lib/utils')
  
  
/**
 * Index - list tasks and app status
 */

exports.index = function(req, res){
  Activity.count(function(err, economicActivitiesCount){
    States.count(function(err, statesCount){
      if (err) res.render(500)
      res.render('admin/index', {
        messages: req.flash('info'),
        economicActivitiesCount: economicActivitiesCount,
        statesCount: statesCount
      })
    })    
  })
}

/**
 * Populate basic data (states, economic sectors, etc)
 */

exports.populate = function(req,res) {
  // Remove current data
  Financing.collection.remove(function(err){
    if (err) res.render(500) 
    Project.collection.remove(function(err){
      if (err) res.render(500) 
      Organization.collection.remove(function(err){
        if (err) res.render(500)
        // starts reading csv
        csv()
        .from.path(__dirname+'/../../data/financings.csv', { columns: true, delimiter: ',', escape: '"' })
        .on('record', function(row,index){
          beneficiaryName = row['Beneficiado (Empresa/Estado)'].trim()
          // insert or update beneficiary
          Organization.findOneAndUpdate({name: beneficiaryName},{$set: { name: beneficiaryName }}, {upsert: true}, function(err,org){
            if (err) res.render(500)
            projectInfo = {
              title: row['Resumo do Projeto'].trim(),
              description: row['Descrição do Projeto'].trim()
            }
            // insert or update project
            Project.findOneAndUpdate(projectInfo,{$set:projectInfo},{upsert:true},function(err,proj){
              if (err) res.render(500)
              financingInfo = {
                contractDate: moment(row['Contratação'].trim(), 'DD/MM/YYYY'),
                isDirect: row['Tipo de operação'].trim() == 'direto',
                project: proj,
                beneficiary: org,  
                amount: row['Valor da Operação'].trim()
              }
              Financing.findOneAndUpdate(financingInfo,{$set:financingInfo},{upsert:true},function(err){
                if (err) res.render(500)
              })
            })
          })
          
                    
        })
        .on('end', function(){
          Project.updateRelatedFinancings()
          Organization.updateRelatedFinancings()
        })
        .on('error', function(error){
          res.render(500)
        })
        res.redirect('admin')        
      })
    })
  })
}