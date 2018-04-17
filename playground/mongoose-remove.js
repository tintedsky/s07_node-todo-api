const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// })

Todo.findByIdAndRemove('5ad543dcd2496b6c839944f5')
  .then((todo) => {
    console.log(todo);
  });

Todo.findOneAndRemove(_id: '5ad543dcd2496b6c839944f5')
  .then((todo) => {
    console.log(todo);
  });
