const express = require('express');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: 'canBeAnything',
    resave: false,
    saveUninitialized: false,
    cookie: {},
  })
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/users', (req, res) => {
  const data = fs.readFileSync('./data.json', 'utf8');
  let file = JSON.parse(data);
  res.render('users', { users: file.users });
});

app.post('/users', (req, res) => {
  let user = {
    uid: uuidv4(),
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
  };

  const data = fs.readFileSync('./data.json', 'utf8');
  let file = JSON.parse(data);
  file.users.push(user);
  fs.writeFileSync('./data.json', JSON.stringify(file));
  console.log('new user added');
  res.render('users', { users: file.users });
});

app.post('/users/:uid', (req, res) => {
  let user = {
    uid: req.params.uid,
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
  };

  const data = fs.readFileSync('./data.json', 'utf8');
  let file = JSON.parse(data);
  file.users = file.users.filter((data) => data.uid !== user.uid);
  file.users.push(user);
  fs.writeFileSync('./data.json', JSON.stringify(file));
  console.log('User Edited');
  res.render('users', { users: file.users });
});

app.get('/users/:uid', (req, res) => {
  let userId = req.params.uid;

  const data = fs.readFileSync('./data.json', 'utf8');
  let file = JSON.parse(data);
  let index = file.users.findIndex((oldUsers) => oldUsers.uid === userId);
  file.users.splice(index, 1);
  fs.writeFileSync('./data.json', JSON.stringify(file));
  console.log('user deleted');
  res.render('users', { users: file.users });
});

app.get('/editUser/:username/:name/:email/:age/:uid', (req, res) => {
  let user = {
    username: req.params.username,
    name: req.params.name,
    email: req.params.email,
    age: req.params.age,
    uid: req.params.uid,
  };
  res.cookie('uid', req.params.uid);
  res.render('editUser', user);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
