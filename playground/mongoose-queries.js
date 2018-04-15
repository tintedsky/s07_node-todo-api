const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '5ad2c2c4a4baa6cd05b875a0';

//Here we do not manually convert our string to an object
Todo.find({
  _id: id
}).then((todos) => {
  console.log('Todos', todos);
});

Todo.findOne({
  _id:id
}).then((todo) => {
  console.log('Todo', todo);
});

Todo.findById(id)
    .then((todo) => {
      console.log('Todo By Id:', todo)
});

//mongoosejs.com to find the documents for the API provided
