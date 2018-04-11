var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
  text:{
    type:String
  },
  completed:{
    type:Boolean
  },
  completedAt:{
    type:Number
  }
});

var newTodo = new Todo(
  {
    text: 'Feed the cat',
    completed: true,
    completedAt: 123
  }
);

newTodo.save().then((doc) => {
  console.log(JSON.stringify(doc, undefined, 2));
},(err) =>{
  console.log('unable to save', err);
});
//save new something
