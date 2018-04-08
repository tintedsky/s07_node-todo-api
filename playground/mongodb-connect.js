const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    //'return' prevents the rest of the function from executing.
    return console.log('Unable to connect to MongoDB server.');
  }

  console.log('Connected to MongoDB server...')

  /*
  ...
  ...
  ...
  */

  db.close();     /* Close the connection to mongodb server. */
});
