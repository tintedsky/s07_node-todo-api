var mongoose = require('mongoose');

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

module.exports = {Todo};
