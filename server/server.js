var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user')

//ObjectID comes from mongodb, not from mongoose
var {ObjectID} = require('mongodb');


//CRUD methods

var app = express();

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
    console.log('Id not valid');
    return res.status(404).send(); //using return to prevent the program from executing.
  }

  Todo.findById(id).then((doc) => {
    if(doc){
      return res.send(doc);
    }
    res.status(404).send(doc);
  }, (err) => {
    res.status(400).send(null);
  });
  //valid id using isValid()
    // 404 - send bck empty send

  // findById
    // success
       // if todo - send it back
       // if no todo - send back 404 with empty body
    // error;
       //400 - and send empty body back.
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app};
