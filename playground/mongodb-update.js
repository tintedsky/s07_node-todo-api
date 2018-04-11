const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err){
    //'return' prevents the rest of the function from executing.
    return console.log('Unable to connect to MongoDB server.');
  }

  console.log('Connected to MongoDB server...')
  const db = client.db();

  db.collection('Users').findOneAndUpdate(
    {
    _id: new ObjectID('5aca7ef39a05891d6b8a247c')
    }, {
      $set: { name: 'Moose'},
      $inc: { age: 1}
    }, {
      returnOriginal: false
    }).then((result) => {
      console.log(result);
    });

  client.close();
});
