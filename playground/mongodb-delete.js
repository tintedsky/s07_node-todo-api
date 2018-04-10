const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err){
    //'return' prevents the rest of the function from executing.
    return console.log('Unable to connect to MongoDB server.');
  }

  console.log('Connected to MongoDB server...')

  const db = client.db();
  //deleteMany, deleteOne, findOneAndDelete
  db.collection('Users').deleteMany({name: 'Hong'});

  db.collection('Users').findOneAndDelete({_id: new ObjectID('5aca845cff209f20aca20876')})
    .then((result) => {
      console.log(result);
    });

  client.close();
});
