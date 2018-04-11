const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err){
    //'return' prevents the rest of the function from executing.
    return console.log('Unable to connect to MongoDB server.');
  }

  console.log('Connected to MongoDB server...')
  const db = client.db();

  db.collection('Todos').findOneAndUpdate(
    {
      text:'Eat lunch'
    }, {
      $set:{ completed: false }
    }, {
      returnOriginal:false
    }
  ).then((result) => {
    console.log(result);
  });

  client.close();
});
