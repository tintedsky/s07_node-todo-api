const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'abc123!';
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

var hashedPassword = '$2a$10$/YDBGiwFYe5JN8vBJ3XnZ.Kt2RdvUI9FokWVA0oS.ZQcYTT2bJFem';

bcrypt.compare('abc123', hashedPassword, (err, res) => {
  console.log(res);
});
//
// var data = {
//   id: 17
// };
//
//
// var token = jwt.sign(data, '123abc');
//
// var decoded = jwt.verify(token, '123abc');
// console.log('decoded:', decoded);
//
// console.log(token);
