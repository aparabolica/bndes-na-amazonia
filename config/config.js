
var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')

module.exports = {
  development: {
    db: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/bna_dev',
    root: rootPath,
    app: {
      name: 'BNDES na Amazônia'
    }
  },
  test: {
    db: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/bna_test',
    root: rootPath,
    app: {
      name: 'BNDES na Amazônia'
    },
  },
  production: {    
    db: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/heroku_app18624412',
    root: rootPath,
    app: {
      name: 'BNDES na Amazônia'
    }
  }
}