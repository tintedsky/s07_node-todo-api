const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5acd7c8fc03f6a6f89514497';

User.findById(id)
    .then((user) => {
      if(!user){
        return console.log('Unable to find user');
      }
      console.log(JSON.stringify(user, undefined, 2));
    }, (e) => {
      console.log(e);
    });
