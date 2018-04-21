const {SHA256} = require('crypto-js');

var message = "I like moose.";
console.log(message);
console.log(SHA256(message).toString());

var data = {
  id:4
};

var salt = 'somexSalt';

var token = {
  data,
  hash:SHA256(JSON.stringify(data) + salt).toString()
};

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

var resultHash = SHA256(JSON.stringify(data) + salt).toString();

if(resultHash === token.hash){
  console.log('data not manipulated.');
}else{
  console.log('Data was changed. Do not trust.')
}
