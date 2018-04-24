const expect = require('expect');
const request = require('supertest');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');

const {ObjectID} = require('mongodb');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed')

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {  //Without done here, test will succeed forever.
    var text = 'Test todo text';

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }

      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => done(e));
    });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err, res) => {
      if(err){
        return done(err);
      }

      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);  //Here, why not one. The first test already created one record.
        Todo.remove({}).then(() => done());
      })
    })
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('Should return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)  //Missing a forward slash
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text)
    })
    .end(done);
  });

  it('Should return 404 if todo not found', (done) => {
    request(app)
    .get(`/todos/${(new ObjectID).toHexString()}`)
    .expect(404)
    .end(done);
  });

  it('Should return 404 for non-object ids', (done) => {
    request(app)
    .get('/todos/123')
    .expect(404)
    .end(done);
  })
});

describe('DELETE /todos/:id', () => {
  it('Should remove a todo', (done) => {
    var hexId = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }
        // query database using findById()
        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e)=>done());
      });
  });

  it('Should return 404 if todo not found', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('Should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/todos/123')
      .expect(404)
      .end(done);
  });
});

/*should be end(done), NOT end(done()), no parenthese after done */
describe('PATCH /todos/:id', () => {
  it('Should update text and completed', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = 'testing text update';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({text,
             completed: true})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('Should clear completedAt when to do is not completed', (done) => {
     var hexId = todos[1]._id.toHexString();
     var text = 'New text for test';
     request(app)
       .patch(`/todos/${hexId}`)
       .send({text,
              completed: false})
       .expect(200)
       .expect((res) => {
         expect(res.body.todo.completedAt).toNotExist();
         expect(res.body.todo.completed).toBe(false);
         expect(res.body.todo.text).toBe(text);
       })
       .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done)=>{
    var email = 'exattle@gmail.com';
    var password = '123mxt!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err){
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        })
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email:'abc',
        password:'abc1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.body._id).toNotExist();
      })
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    var email = 'jen@gmail.com';
    var password = 'abc123!';

    request(app)
      .post('/users')
      .send({
        email:users[0].email,
        password:'Password123!'
      })
      .expect(400)
      .expect((res) => {
        expect(res.body._id).toNotExist();
      })
      .end(done);
  });
});
