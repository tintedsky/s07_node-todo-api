var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user')


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
  res.send(req.params);
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app};
