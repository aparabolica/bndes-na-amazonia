
var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')

module.exports = {
  development: {
    db: 'mongodb://localhost/bna_dev',
    root: rootPath,
    app: {
      name: 'BNDES na Amazônia'
    }
  },
  test: {
    db: 'mongodb://localhost/bna_test',
    root: rootPath,
    app: {
      name: 'BNDES na Amazônia'
    }
  },
  production: {}
}