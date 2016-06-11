# BNDES na Amazônia

*(English bellow)*

>  O site [www.bndesnaamazonia.org](http://bndesnaamazonia.org) é um visualizador dos dados obtidos na série de reportagens realizadas pela [Agência Pública](http://apublica.org/) em 2013 sobre os financiamentos do [Banco Nacional de Desenvolvimento Econômico e Social (BNDES)](http://www.bndes.gov.br) na Amazônia. Este repositório contém o código-fonte do site e os dados da reportagem em formato aberto.

The website [www.bndesnaamazonia.org](http://bndesnaamazonia.org) is a visualization of the data obtained in the series of reports made by the [Agência Pública](http://apublica.org/) in 2013 on the financing projects of the [National Bank for Economic and Social Development (BNDES)](http://www.bndes.gov.br) in the Amazon. This  repository contains the website's source code and report data in a open format.

## The website

The website is made in [Node.js](nodejs.org) and uses [MongoDB](www.mongodb.com). Install these dependencies and follow these steps do run it locally:

1. `cd <dev-path>` (replace `<dev-path>` with your dev directory)
1. `git clone https://github.com/ecodigital/bndesnaamazonia.git`
1. `cd bndesnaamazonia`
1. `npm install`
1. `npm start`
1. Visit http://localhost:3000/populate

## The data

All data are available as CSV files at [this repository](/blob/master/data) and at the [website](http://bndesnaamazonia.org).

## Authors

* [Bruno Fonseca](https://twitter.com/obruno10) - Journalist
* [Miguel Peixe](https://github.com/miguelpeixe) - Webdesigner
* [Vitor George](https://github.com/vgeorge) - Developer

## License

* Source code: [MIT](/blob/master/LICENSE)
* Data: [Public domain](https://en.wikipedia.org/wiki/Public_domain)
