const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err){
    //'return' prevents the rest of the function from executing.
    return console.log('Unable to connect to MongoDB server.');
  }

  console.log('Connected to MongoDB server...')

  const db = client.db();
  // db.collection('Todos').find({name:'Hong'}).count()
  //   .then((count) => {
  //     console.log(`Todos count: ${count}`);
  //   }, (err) => {
  //     console.log('Unable to fetch todos', err);
  //   }
  // );

  db.collection('Users').find({name:'Moose'}).count()
    .then((count) => {
      console.log(`Users count with: ${count}`);
    }, (err) => {
      console.log('Unable to fetch Users');
    });

  client.close();
});
