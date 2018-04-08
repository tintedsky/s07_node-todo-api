const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err){
    //'return' prevents the rest of the function from executing.
    return console.log('Unable to connect to MongoDB server.');
  }

  console.log('Connected to MongoDB server...')

  const db = client.db('TodoApp');
  db.collection('Users').insertOne({
    name: 'Hong',
    age: 25,
    location: '999 Little Rock, Montreal'
  }, (err, result) => {
    if(err){
      return console.log('Unable to insert user to Users', err);
    }

    console.log(JSON.stringify(result.ops, undefined, 2));
  });

  client.close();     /* Close the connection to mongodb server. */
});
