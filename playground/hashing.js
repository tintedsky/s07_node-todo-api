const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id: 17
};


var token = jwt.sign(data, '123abc');

var decoded = jwt.verify(token, '123abc');
console.log('decoded:', decoded);

console.log(token);
