/*
*
*
*       Complete the handler logic below
*       
*       
*/

function ConvertHandler() {
  
  this.getNum = function(input) {
    var result;
    var decodedInput = decodeURIComponent(input || '');
    var char = decodedInput.match(/[a-zA-Z]/);
    var index = decodedInput.indexOf(char);
    var numStr = index > -1 ? decodedInput.slice(0, index) : decodedInput;
    var numArr = numStr.split('/');
    if (numArr.length === 2) {
      result = +numArr[0] / +numArr[1];
    } else {
      result = +numStr;
    }

    if (index === 0) {
      result = 1;
    }

    if (isNaN(result)) {
      result = 'invalid number';
    }

    return result;
  };
  
  this.getUnit = function(input) {
    var result;
    var decodedInput = decodeURIComponent(input || '');
    var char = decodedInput.match(/[a-zA-Z]/);
    var index = decodedInput.indexOf(char);
    var unit = index > -1 ? decodedInput.slice(index) : 'invalid unit';    
    result = ['gal', 'l', 'lbs', 'kg', 'mi', 'km', 'GAL', 'L', 'LBS', 'KG', 'MI', 'KM', 'invalid unit'].indexOf(unit) > -1 ? unit : 'invalid unit';
    return result;
  };
  
  this.getReturnUnit = function(initUnit) {
    var result;
    var initUnitLower = initUnit.toLowerCase();
    switch (initUnitLower) {
      case 'gal':
        result = 'l';
        break;
      case 'l':
        result = 'gal';
        break;
      case 'lbs':
        result = 'kg';
        break;
      case 'kg':
        result = 'lbs';
        break;
      case 'mi':
        result = 'km';
        break;
      case 'km':
        result = 'mi';
        break;
      default:
        result = 'invalid unit';
        break;
    }

    return result;
  };

  this.formatNum = function(num) {
    var result;
    result = isNaN(num) ? 'invalid number' : num.toFixed(5);
    return result;
  };

  this.spellOutUnit = function(unit) {
    var result;
    var unitLower = unit.toLowerCase();
    var unitMap = {
      gal: 'gallons',
      l: 'liters',
      lbs: 'pounds',
      kg: 'kilograms',
      mi: 'miles',
      km: 'kilometers',
      'invalid unit': 'invalid unit',
    };

    result = unitMap[unitLower] || 'invalid unit';
    return result;
  };
  
  this.convert = function(initNum, initUnit) {
    var initUnitLower = initUnit.toLowerCase();
    var galToL = 3.78541;
    var lbsToKg = 0.453592;
    var miToKm = 1.60934;
    var result;
    if (isNaN(initNum)) {
      return 'invalid number';
    }

    switch (initUnitLower) {
      case 'gal':
        result = initNum * galToL;
        break;
      case 'l':
        result = initNum / galToL;
        break;
      case 'lbs':
        result = initNum * lbsToKg;
        break;
      case 'kg':
        result = initNum / lbsToKg;
        break;
      case 'mi':
        result = initNum * miToKm;
        break;
      case 'km':
        result = initNum / miToKm;
        break;
      default:
        result = initNum;
        break;
    }

    return result;
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    var result;
    var initNumStr = this.formatNum(initNum);
    var initUnitStr = this.spellOutUnit(initUnit);
    var returnNumStr = this.formatNum(returnNum);
    var returnUnitStr = this.spellOutUnit(returnUnit);
    result = initNumStr + ' ' + initUnitStr + ' converts to ' + returnNumStr + ' ' + returnUnitStr;
    return result;
  };

  this.getReturnObj = function(initNum, initUnit, returnNum, returnUnit, string) {
    var returnObj = {};
    returnObj.initNum = initNum;
    returnObj.initUnit = initUnit;
    returnObj.returnNum = isNaN(returnNum) ? 'invalid number' : +(this.formatNum(returnNum));
    returnObj.returnUnit = returnUnit;
    returnObj.string = string;
    return returnObj;
  };
}

module.exports = ConvertHandler;
