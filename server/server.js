var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
  text:{
    type:String,
    required: true,   //should exists
    minlength: 1,     //Could not be empty string
    trim: true        //Trim the leading and trailing spaces
  },
  completed:{
    type: Boolean,
    default: false
  },
  completedAt:{
    type: Number,
    default: null
  }
});

var newTodo = new Todo(
  {
    text: 'Edit the file'
  }
);

newTodo.save().then((doc) => {
  console.log(JSON.stringify(doc, undefined, 2));
},(err) =>{
  console.log('unable to save', err);
});
