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
    .set('x-auth', users[0].tokens[0].token)
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
    .set('x-auth', users[0].tokens[0].token)
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
  it('should get first user\'s todos', (done) => {
    request(app)
    .get('/todos')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(1);
    })
    .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('Should return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)  //Missing a forward slash
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text)
    })
    .end(done);
  });

  it('Should return 404 if todo not found', (done) => {
    request(app)
    .get(`/todos/${(new ObjectID).toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('Should return 404 for non-object ids', (done) => {
    request(app)
    .get('/todos/123')
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('Should not return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)  //Missing a forward slash
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('Should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
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
          expect(todo).toBeFalsy();
          done();
        }).catch((e)=>done());
      });
  });

  it('Should return 404 if todo not found', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('Should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/todos/123')
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('Should not remove a todo of another user', (done) => {
    var hexId = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if(err){
          return done(err);
        }
        // query database using findById()
        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeFalsy(); //???? toExist or toBeFalsy
          done();
        }).catch((e)=>done());
      });
  });
});

/*should be end(done), NOT end(done()), no parenthese after done */
describe('PATCH /todos/:id', () => {
  it('Should update text and completed', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = 'testing text update';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({text, completed: true})
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        //expect(res.body.todo.completedAt).toBeA('number');
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done);
  });

  it('Should not update todo created by other user', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = 'testing text update';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({text, completed: true})
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('Should clear completedAt when to do is not completed', (done) => {
     var hexId = todos[1]._id.toHexString();
     var text = 'New text for test';
     request(app)
       .patch(`/todos/${hexId}`)
       .send({text,  completed: false})
       .set('x-auth', users[1].tokens[0].token)
       .expect(200)
       .expect((res) => {
         expect(res.body.todo.completedAt).toBeFalsy();
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
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err){
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch((e)=>done(e));
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
        expect(res.body._id).toBeFalsy();
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
        expect(res.body._id).toBeFalsy();
      })
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body.email).toBe(users[1].email);
      })
      .end((err, res) => {
        if (err){
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.toObject().tokens[1]).toMatchObject({
            access:'auth',
            token:res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email:users[1].email,
        password: 'abcdefg1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.header['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e)=>done(e));
      })
  });
});

describe('DELETE /users/me/token', ()=>{
  it('should remove token of the specific user', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if(err){
          done(err);
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e)=>done(e));
      });
  });
});
