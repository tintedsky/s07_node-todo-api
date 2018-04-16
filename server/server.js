var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user')

//ObjectID comes from mongodb, not from mongoose
var {ObjectID} = require('mongodb');


//CRUD methods

var app = express
const port = process.env.PORT || 3000;

//bodyParser.json() will return a function with which app will use as a middleware. Then we can send json to our express application.
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text:req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });

});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send(); //using return to prevent the program from executing.
  }

  Todo.findById(id).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
