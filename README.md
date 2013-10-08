# Elos 

A mapping application.

## Install

**NOTE:** You need to have node.js, mongodb and [imagemagick](http://www.imagemagick.org/script/index.php) installed and running.

```sh
  $ git clone git://github.com/vgeorge/elos.git
  $ npm install
  $ cp config/config.example.js config/config.js
  $ cp config/imager.example.js config/imager.js
  $ npm start
```

**NOTE:** Do not forget to update your facebook twitter and github APP_ID and APP_SECRET in `config/config.js`. Also if you want to use image uploads, don't forget to replace the S3 and Rackspace keys in `config/imager.js`.

Then visit [http://localhost:3000/](http://localhost:3000/)

## Tests

```sh
$ npm test
```

## Todo

- [ ] load city information as value types
- [ ] load cnae codes as value types from json
- [ ] remove autentication from third party sites
- [ ] application title
- [ ] find by slug

## License
(The MIT License)

Copyright (c) 2013 Vitor George < [vitor.george@gmail.com](mailto:vitor.george@gmail.com) >

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
