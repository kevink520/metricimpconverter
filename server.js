'use strict';

var express     = require('express');
var helmet      = require('helmet');
var bodyParser  = require('body-parser');
var expect      = require('chai').expect;
var cors        = require('cors');

var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');

var app = express();

app.use(helmet());

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

app.route('/api/convert')
  .get(function (req, res) {
    var input = decodeURIComponent(req.query.input || '');
    var char = input.match(/[a-zA-Z]/);
    var index = input.indexOf(char);
    var result = {};
    var numStr = index > -1 ? input.slice(0, index) : input;
    var numArr = numStr.split('/');
    if (numArr.length === 2) {
      result.initNum = +numArr[0] / +numArr[1];
    } else {
      result.initNum = +numStr;
    }

    if (index === 0) {
      result.initNum = 1;
    }

    result.initUnit = index > -1 ? input.slice(index).toLowerCase() : 'invalid unit';
    switch (result.initUnit) {
      case 'gal':
        result.returnNum = result.initNum * 3.78541;
        result.returnUnit = 'L';
        break;
      case 'l':
        result.returnNum = result.initNum / 3.78541;
        result.returnUnit = 'gal';
        break;
      case 'lbs':
        result.returnNum = result.initNum * 0.453595;
        result.returnUnit = 'kg';
        break;
      case 'kg':
        result.returnNum = result.initNum / 0.453595;
        result.returnUnit = 'lbs';
        break;
      case 'mi':
        result.returnNum = result.initNum * 1.60934;
        result.returnUnit = 'km';
        break;
      case 'km':
        result.returnNum = result.initNum / 1.69934;
        result.returnUnit = 'mi';
        break;
      default:
        result.returnNum = result.initNum;
        result.initUnit = 'invalid unit';
        result.returnUnit = 'invalid unit';
        break;
    }

    if (isNaN(result.initNum)) {
      result.initNum = 'invalid number';
    } else {
      result.initNum = result.initNum.toFixed(5);
    }

    if (isNaN(result.returnNum)) {
      result.returnNum = 'invalid number';
    } else {
      result.returnNum = result.returnNum.toFixed(5);
    }

    var unitMap = {
      gal: 'gallons',
      l: 'liters',
      L: 'liters',
      lbs: 'pounds',
      kg: 'kilograms',
      mi: 'miles',
      km: 'kilometers',
      'invalid unit': 'invalid unit',
    };

    result.string = result.initNum + ' ' + unitMap[result.initUnit] + ' converts to ' + result.returnNum + ' ' + unitMap[result.returnUnit];
    res.json(result);
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);  
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 1500);
  }
});

module.exports = app; //for testing
